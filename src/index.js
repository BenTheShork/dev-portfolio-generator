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
      message: 'Select your skills (Space to select, Enter to confirm):',
      choices: [
        { name: 'JavaScript', checked: false },
        { name: 'TypeScript', checked: false },
        { name: 'Python', checked: false },
        { name: 'Java', checked: false },
        { name: 'C++', checked: false },
        { name: 'C#', checked: false },
        { name: 'Ruby', checked: false },
        { name: 'Go', checked: false },
        { name: 'Swift', checked: false },
        { name: 'Kotlin', checked: false },
        { name: 'Rust', checked: false },
        
        new inquirer.Separator('\n=== Frontend Development ==='),
        { name: 'React', checked: false },
        { name: 'Angular', checked: false },
        { name: 'Vue.js', checked: false },
        { name: 'Next.js', checked: false },
        { name: 'HTML5', checked: false },
        { name: 'CSS3', checked: false },
        { name: 'Sass/SCSS', checked: false },
        { name: 'Tailwind CSS', checked: false },
        { name: 'Material UI', checked: false },
        
        new inquirer.Separator('\n=== Backend Development ==='),
        { name: 'Node.js', checked: false },
        { name: 'Django', checked: false },
        { name: 'Flask', checked: false },
        { name: 'Spring Boot', checked: false },
        { name: 'Express.js', checked: false },
        { name: 'FastAPI', checked: false },
        { name: 'GraphQL', checked: false },
        
        new inquirer.Separator('\n=== Mobile Development ==='),
        { name: 'React Native', checked: false },
        { name: 'Flutter', checked: false },
        { name: 'iOS Development', checked: false },
        { name: 'Android Development', checked: false },
        
        new inquirer.Separator('\n=== Database ==='),
        { name: 'MongoDB', checked: false },
        { name: 'PostgreSQL', checked: false },
        { name: 'MySQL', checked: false },
        { name: 'Redis', checked: false },
        { name: 'Firebase', checked: false },
        
        new inquirer.Separator('\n=== Cloud & DevOps ==='),
        { name: 'AWS', checked: false },
        { name: 'Google Cloud', checked: false },
        { name: 'Azure', checked: false },
        { name: 'Docker', checked: false },
        { name: 'Kubernetes', checked: false },
        { name: 'Jenkins', checked: false },
        { name: 'GitHub Actions', checked: false },
        { name: 'Terraform', checked: false },
        
        new inquirer.Separator('\n=== AI & Data Science ==='),
        { name: 'Machine Learning', checked: false },
        { name: 'Deep Learning', checked: false },
        { name: 'TensorFlow', checked: false },
        { name: 'PyTorch', checked: false },
        { name: 'Computer Vision', checked: false },
        { name: 'NLP', checked: false },
        { name: 'Data Analysis', checked: false },
        { name: 'Pandas', checked: false },
        { name: 'Scikit-learn', checked: false },
        
        new inquirer.Separator('\n=== Other Technologies ==='),
        { name: 'Git', checked: false },
        { name: 'RESTful APIs', checked: false },
        { name: 'Linux', checked: false },
        { name: 'Agile', checked: false },
        { name: 'CI/CD', checked: false },
        { name: 'Testing', checked: false },
        { name: 'Microservices', checked: false },
        { name: 'System Design', checked: false },
        { name: 'WebSockets', checked: false },
        new inquirer.Separator('\n=== Programming Languages ==='),

      ],
      pageSize: 20  
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