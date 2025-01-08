#!/usr/bin/env node
import inquirer from 'inquirer';
import { Octokit } from 'octokit';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { generatePortfolio } from './generator.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  console.log(chalk.blue.bold('🚀 Welcome to Dev Portfolio Generator!'));

  const answers = await inquirer.prompt([
    {
      type: 'input',
      name: 'githubUsername',
      message: 'What is your GitHub username?',
      validate: input => input.length > 0
    },
    {
      type: 'input',
      name: 'name',
      message: 'What is your full name?',
      validate: input => input.length > 0
    },
    {
      type: 'input',
      name: 'email',
      message: 'What is your email address? (optional)',
    },
    {
      type: 'input',
      name: 'linkedinUrl',
      message: 'What is your LinkedIn profile URL? (optional)',
    },
    {
      type: 'input',
      name: 'bio',
      message: 'Write a short bio about yourself:',
    },
    {
      type: 'checkbox',
      name: 'skills',
      message: 'Select your skills:',
      choices: [
        'JavaScript', 'Python', 'Java', 'C++', 'React',
        'Node.js', 'SQL', 'AWS', 'Docker', 'Git'
      ]
    }
  ]);

  const spinner = ora('Generating your portfolio...').start();

  try {
    const octokit = new Octokit();
    const { data: repos } = await octokit.rest.repos.listForUser({
      username: answers.githubUsername,
      sort: 'updated',
      per_page: 10
    });

    const portfolioData = {
      ...answers,
      repos: repos.map(repo => ({
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        stars: repo.stargazers_count,
        language: repo.language
      }))
    };

    await generatePortfolio(portfolioData);
    
    spinner.succeed('Portfolio generated successfully!');
    console.log(chalk.green('\n✨ Your portfolio has been generated in the "dist" folder'));
    console.log(chalk.yellow('📝 You can customize the template in the "templates" folder'));
  } catch (error) {
    spinner.fail('Error generating portfolio');
    console.error(chalk.red(error.message));
    process.exit(1);
  }
}

main();