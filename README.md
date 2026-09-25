# RobloxVisitBot — Web Dashboard

This repository now includes a browser-based project website for RobloxVisitBot.

## Website

- index.html — website structure
- style.css — responsive dark UI
- script.js — navigation enhancement

The site is a static frontend and can be deployed directly to Vercel or another static hosting provider.

## Architecture note

The original main.py is a Windows-only local application. It depends on Roblox client files, Windows APIs, local processes, and authentication cookies. A browser cannot directly launch or control those local Roblox processes.

The website is therefore a dashboard/documentation frontend rather than a browser implementation of the local program.

Do not put Roblox authentication cookies or other secrets into the website, client-side JavaScript, or a public repository.

## Original project

The original Python implementation remains in the repository for reference. The website does not execute it.

## Deploy

Import this repository into Vercel. No framework is required; Vercel can serve index.html directly.

Repository: https://github.com/Zeroid-San/RobloxVisitBot
