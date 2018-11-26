const submitButton = document.querySelector("button");
const activityInput = document.querySelector(".activity-input");
const activityHours = document.querySelector(".activity-hours");

let data = {
  columns: [
    ["reading", 3, 4, 2, 1, 5],
    ["working out", 1, 1, 0, 2, 0],
    ["family time", 2, 1, 2, 4, 3]
  ],
  type: "donut"
};

var chart = c3.generate({
  data
});

submitButton.addEventListener("click", e => {
  e.preventDefault();
  let newEntry = [];
  const hoursValue = parseInt(activityHours.value);
  const activityValue = activityInput.value;
  newEntry.push(activityValue);
  newEntry.push(hoursValue);
  data.columns.push(newEntry);
  chart.load(data);
  activityInput.value = "";
  activityHours.value = "";
});
