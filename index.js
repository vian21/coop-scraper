const fs = require("fs");
const cherrio = require("cheerio");
let data;

try {
  data = fs.readFileSync("indEX.html", "utf-8");
} catch (err) {
  console.log(err);
}

//selector
const $ = cherrio.load(data);

/***********************************
 * Programs
 ***********************************/
let programs = [];

$("option:selected").each((number, element) => {
  programs.push($(element).text().trim());
});
//pop the last one since it contains the year of the coop
programs.pop();

/***********************************
 * Job Postings
 ***********************************/
let jobPostings = [];

$("div.card.col-md-5").each((number, element) => {
  // $(element).children(".panel").children(".panel-heading").children().text()
  const jobTitle = $(element)
    .children(".panel")
    .children(".panel-heading")
    .text()
    .replace(/\s+/g, " ")
    .trim();
  const jobLink = $(element)
    .children(".panel")
    .children(".panel-heading")
    .children()
    .children()
    .attr("href");
  jobPostings.push([jobTitle, jobLink]);
});

const summerJobs = {
  programs: programs,
  jobPostings: jobPostings,
};

//used to count the number of jobs added
let n_jobs = 0;

/*
 * Removes duplicate jobs
 */
function unique(array) {
  return array.filter((element, index, originalArray) => {
    return (
      originalArray.findIndex((t) => {
        return t[0] === element[0] && t[1] === element[1];
      }) === index
    );
  });
}

try {
  const jobs = JSON.parse(fs.readFileSync("indEX.json", "utf-8"))?.jobPostings;

  if (jobs) {
    summerJobs.jobPostings = summerJobs.jobPostings.concat(jobs);
    n_jobs = jobs.length;
  }
} catch (err) {}

//remove duplicates
summerJobs.jobPostings = unique(summerJobs.jobPostings);

//count the number of jobs added
n_jobs = summerJobs.jobPostings.length - n_jobs;

console.log("Added:", n_jobs, "Jobs");
console.log("Total:", summerJobs.jobPostings.length, "Jobs");

fs.writeFileSync("indEX.json", JSON.stringify(summerJobs, null, 2));
