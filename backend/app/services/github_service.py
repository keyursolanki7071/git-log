import httpx
from urllib.parse import urlencode
from app.core.config import settings

class GitHubService:
    def __init__(self):
        self.client_id = settings.GITHUB_CLIENT_ID
        self.client_secret = settings.GITHUB_CLIENT_SECRET
        # Local development callback URI. 
        self.redirect_uri = "http://localhost:8000/api/v1/auth/github/callback"

    def get_authorization_url(self, state: str) -> str:
        """
        Constructs the GitHub OAuth authorization URL.
        """
        params = {
            "client_id": self.client_id,
            "redirect_uri": self.redirect_uri,
            "scope": "repo read:user user:email",
            "state": state,
        }
        return f"https://github.com/login/oauth/authorize?{urlencode(params)}"

    async def exchange_code_for_token(self, code: str) -> str | None:
        """
        Exchanges the temporary code for a permanent access token.
        """
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "https://github.com/login/oauth/access_token",
                json={
                    "client_id": self.client_id,
                    "client_secret": self.client_secret,
                    "code": code,
                    "redirect_uri": self.redirect_uri,
                },
                headers={"Accept": "application/json"},
            )
            
            data = response.json()
            if "error" in data:
                return None
                
            return data.get("access_token")

    async def get_github_user_profile(self, access_token: str) -> dict | None:
        """
        Fetches the authenticated user's GitHub profile data.
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.github.com/user",
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github.v3+json",
                },
            )
            
            if response.status_code != 200:
                return None
                
            return response.json()

    async def get_user_repositories(self, access_token: str) -> list[dict] | None:
        """
        Fetches the repositories for the authenticated GitHub user.
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                "https://api.github.com/user/repos",
                params={"per_page": 100, "sort": "updated"},
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github.v3+json",
                },
            )
            
            if response.status_code != 200:
                return None
                
            return response.json()

    async def get_repository_commits(self, access_token: str, repository_name: str, since: str, until: str, branch: str | None = None) -> list[dict] | None:
        """
        Fetches the commits for a specific repository within a date range.
        repository_name should be formatted as "owner/repo".
        since and until should be ISO 8601 formatted strings (e.g., "YYYY-MM-DDTHH:MM:SSZ").
        branch is the name of the branch to get commits from.
        """
        async with httpx.AsyncClient() as client:
            params = {"since": since, "until": until, "per_page": 100}
            if branch:
                params["sha"] = branch
                
            response = await client.get(
                f"https://api.github.com/repos/{repository_name}/commits",
                params=params,
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github.v3+json",
                },
            )
            
            if response.status_code != 200:
                print(f"Failed to fetch commits: {response.text}")
                return None
                
            raw_commits = response.json()
            commits = []
            for c in raw_commits:
                commit_info = c.get('commit', {})
                commits.append({
                    'sha': c.get('sha'),
                    'message': commit_info.get('message', ''),
                    'author': commit_info.get('author', {}).get('name', 'Unknown'),
                    'date': commit_info.get('author', {}).get('date', '')
                })
            return commits

    async def get_repository_branches(self, access_token: str, repository_name: str) -> list[dict] | None:
        """
        Fetches the branches for a specific repository.
        repository_name should be formatted as "owner/repo".
        """
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"https://api.github.com/repos/{repository_name}/branches",
                params={"per_page": 100},
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Accept": "application/vnd.github.v3+json",
                },
            )
            
            if response.status_code != 200:
                print(f"Failed to fetch branches: {response.text}")
                return None
                
            raw_branches = response.json()
            branches = []
            for b in raw_branches:
                branches.append({
                    'name': b.get('name'),
                    'commit_sha': b.get('commit', {}).get('sha')
                })
            return branches

github_service = GitHubService()
