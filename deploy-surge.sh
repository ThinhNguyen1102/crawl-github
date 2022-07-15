# build app
npm run build

# Move to build folder
cd build

# clone index.html into 200.html
cp index.html 200.html

# start deploying via Surge

surge . crawl-github-thinh.surge.sh
