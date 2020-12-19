# huyen-nguyen.github.io
*Hey! It's the bio/blog site I've been longing to build!*

https://huyen-nguyen.github.io/

## How to run
0\. Make sure all dependencies in your Gemfile are available to the application

    bundle install
    
1\. Serve the site and visit it at http://127.0.0.1:4000

    bundle exec jekyll serve
   
2\. Commit the changes to git

3\. Deploy the page to [GitHub Pages](https://pages.github.com/) on branch `master` and use branch `source` for the 
source code

    ./bin/deploy --user
    
---
Note from the [developers](https://github.com/alshedivat/al-folio/blob/master/README.md#installation): By default, the 
script uses the `master` branch for the source code and deploys the webpage to `gh-pages`. The optional flag `--user`
 tells it to deploy to `master` and use `source` for the source code instead. Using `master` for deployment is a 
 convention for [user and organization pages](https://help.github.com/articles/user-organization-and-project-pages/).

By default, the script uses the `master` branch for the source code and deploys the webpage to `gh-pages`:

    ./bin/deploy
    
