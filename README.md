# Chicken Marketplace

A tiny static demo app to post and browse chicken listings. Uses localStorage to persist listings and allows adding an optional image URL for each listing.

How to use

- Open `index.html` in your browser (double-click). Add a listing using the form and it will be saved to localStorage.

Connecting to GitHub

1. Create an empty repository on GitHub (no README, no license). Copy the repository URL (HTTPS).
2. Run the following commands in this project folder:

```powershell
git remote add origin <YOUR_GITHUB_REPO_URL>
git branch -M main
git push -u origin main
```

Or, if you have the GitHub CLI (`gh`) installed, you can run:

```powershell
gh repo create --public --source=. --remote=origin --push
```

If you want me to run the push for you, provide the repository URL or authorize the GitHub CLI and I can create the remote from here.
