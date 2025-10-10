fetch("https://api.github.com/users/Ashanya20/repos")
    .then(response => response.json())
    .then(repositories => {
        console.log(repositories);
    })
    .catch(error => console.error(error));