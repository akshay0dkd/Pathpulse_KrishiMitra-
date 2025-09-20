# How to Add This Project to a GitHub Repository

This guide provides the step-by-step instructions to upload your project code to a new GitHub repository.

Follow these instructions from your local machine's command line or terminal. You must have `git` installed.

## Step 1: Create a New Repository on GitHub

1.  Go to [GitHub.com](https://github.com) and log in.
2.  Click the **+** icon in the top-right corner and select **"New repository"**.
3.  Give your repository a name (e.g., `sih-krishimitra-prototype`).
4.  Choose whether to make it public or private.
5.  **Important**: Do **not** initialize the repository with a README, .gitignore, or license file, as this project already contains them.
6.  Click **"Create repository"**.

## Step 2: Push Your Existing Code from the Command Line

After creating the repository, GitHub will show you a page with commands. You will use the "…or push an existing repository from the command line" option.

Open your terminal or command prompt, navigate into your project's root folder, and run these commands one by one.

1.  **Initialize a git repository in your project folder:**
    ```bash
    git init -b main
    ```

2.  **Add all your project files to be tracked:**
    ```bash
    git add .
    ```

3.  **Commit the files (save a snapshot of your project):**
    ```bash
    git commit -m "feat: Initial commit of KrishiMitra prototype"
    ```

4.  **Link your local repository to the one on GitHub:**
    ```bash
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY_NAME.git
    ```
    **Important:** Replace `YOUR_USERNAME` and `YOUR_REPOSITORY_NAME` with your actual GitHub username and the repository name you chose in Step 1. You can copy this exact URL from the GitHub page.

5.  **Push your code to GitHub:**
    ```bash
    git push -u origin main
    ```

After these steps are complete, refresh your GitHub repository page. You will see all of your project files there, ready for you to share or continue working on.
