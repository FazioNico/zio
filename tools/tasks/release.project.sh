# @Author: Nicolas Fazio <webmaster-fazio>
# @Date:   20-10-2017
# @Email:  contact@nicolasfazio.ch
# @Last modified by:   webmaster-fazio
# @Last modified time: 08-01-2018
# @Url: https://gist.github.com/FazioNico/e22a09144cad8de05d74b7b3bcc6004e

# release script v.0.1.0

# git repository config
REPOSITORY_URL='https://github.com/fazionico/zio-cli';
REPOSITORY_ORIGIN='github'; # bitbucket|github
CURRENT_VERSION=$(grep '"version":' package.json | cut -d\" -f4);

# define $output + $version
function checkVersion {
	output=$(npm version ${release} --no-git-tag-version)
	version=${output:1}
}

# update version of file like package.json
function bumpPackage {
	search='("version":[[:space:]]*").+(")'
	replace="\1${version}\2"
	sed -i ".tmp" -E "s/${search}/${replace}/g" "$1"
	rm "$1.tmp"
}

# update version of file content text like badge color
function bumpMD {
	search='(version-*).+(-blue.svg)'
	replace="\1${version}\2"
	sed -i ".tmp" -E "s/${search}/${replace}/g" "$1"
		rm "$1.tmp"
}

# helper function
function help {
	echo "Usage: $(basename $0) [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease]"
}

# define REPOSITORY_TAGSURL & REPOSITORY_COMMITSURL
function defineRepositoryLinks(){
	if [ "$REPOSITORY_ORIGIN" = "bitbucket" ]; then
		REPOSITORY_TAGSURL="${REPOSITORY_URL}/src/?at=${output}"
		REPOSITORY_COMMITSURL="${REPOSITORY_URL}/commits"
	fi;
	if [ "$REPOSITORY_ORIGIN" = "github" ]; then
		REPOSITORY_TAGSURL="${REPOSITORY_URL}/releases/tag/${output}"
		REPOSITORY_COMMITSURL="${REPOSITORY_URL}/commit"
	fi;
}

# function to build CHANGELOG.md with commits between 2 tags
function changelog(){
	dateCommit=$(git log -1 --date=short --pretty=format:%cd)
	firstTag=$(git tag | sort -r | head -1)
	secondTag=$(git tag | sort -r | head -2 | awk '{split($0, tags, "\n")} END {print tags[1]}')
	# git log `git describe --tags --abbrev=0 HEAD^`..HEAD
	# echo "Changes between ${secondTag} and ${firstTag}\n"
	# git log  --pretty=format:' * %s' ${secondTag}..${firstTag}
	fileContent=$(<CHANGELOG.md);

echo '# CHANGELOG

## ['$output']('$REPOSITORY_TAGSURL') ('$dateCommit')' > CHANGELOG.md;
git log `git describe --tags --abbrev=0 HEAD^`..HEAD --pretty=format:'- [%h]('$REPOSITORY_COMMITSURL'/%H) %s' ${secondTag}..${firstTag}  --reverse --no-merges | grep ": " >> CHANGELOG.md
echo '
'  >> CHANGELOG.md;

echo "$fileContent" | sed -e '1d' >> CHANGELOG.md;
}


# check if script is run with correct argument
if [ -z "$1" ] || [ "$1" = "help" ]; then
	help
	exit
fi;

# Check if current branch is "master" or "dev".
CURRENTBRANCH=$(git rev-parse --abbrev-ref HEAD)
if [ "$CURRENTBRANCH" = "master" ] || [ "$CURRENTBRANCH" = "dev" ]; then
	echo '######################################';
	echo '[ERROR] Aborting script: You need to create a new feature branch for your changes.';
  exit 1;
fi

# establish branch and tag name variables
release=$1
devBranch=dev
masterBranch=master

# check if is a git repository
if [ -d ".git" ]; then
	# check if have change unstaged
  changes=$(git status --porcelain);

	if [ -z "${changes}" ]; then
		checkVersion;
		defineRepositoryLinks;
		releaseBranch=release/$version
		# checkout release branch
		git checkout -b $releaseBranch
		#  bump files version
		bumpPackage "package.json";
		bumpMD "README.md";
		changelog;
    # add & commit changes
		git add .
		git commit -m "Bump to ${version}";
		# create tags version
		git tag -a "${output}" -m "Release ${version}";
		# merge release branch with the new version number into master
		git checkout $masterBranch;
		git merge --no-ff $releaseBranch -m"Merge release $version"
		# merge release branch with the new version number back into develop branch
		git checkout $devBranch;
		git merge --no-ff $releaseBranch -m"Merge release $version"
		# remove release branch
		git branch -d $releaseBranch;
		git checkout $masterBranch;
    # if have a remote origin
		if [ -d ".git/refs/remotes" ]; then
      # push tags & master
			git push origin --tags;
			git push origin master;
			# delete current working branch
			git branch -d $CURRENTBRANCH
			# npm publish ./
		else
			echo 'Create remote origin to push release tags'
		fi

	else
		echo "Please commit staged files prior to bumping"
	fi
else
	echo "Please create a git repository by runing $ git init and rerun commande.";
fi
