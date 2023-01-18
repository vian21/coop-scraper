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

console.log("Parsed:", summerJobs.jobPostings.length, "Jobs");
fs.writeFileSync("indEX.json", JSON.stringify(summerJobs, null, 2));
