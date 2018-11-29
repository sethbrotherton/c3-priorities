const submitButton = document.querySelector("button");
const activityInput = document.querySelector(".activity-input");
const activityHours = document.querySelector(".activity-hours");
const paths = document.querySelectorAll("path");
const errorField = document.querySelector(".error-field");

let data = {
  columns: [], //initialData,
  type: "donut",
  tooltip: {
    show: true
  },
  onclick: function handleDelete(d, element) {
    //console.log(d);
    const id = data.columns[d.index][2];
    console.log(id);
    db.collection("priorities")
      .doc(id)
      .delete()
      .then(() => {
        console.log("You successfuly deleted a document");
      })
      .catch(e => {
        console.log(e);
      });
    //chart.load(data);
  }
};

let size = {
  height: 500,
  width: 500
};

let transition = {
  duration: 1000
};

var chart = c3.generate({
  data,
  size,
  transition,
  //tooltip,
  pie: {
    expand: false
  }
});

submitButton.addEventListener("click", e => {
  if (activityInput.value && parseFloat(activityHours.value) > 0) {
    e.preventDefault();
    errorField.textContent = "";
    const hoursValue = parseFloat(activityHours.value);
    const activityValue = activityInput.value;

    let priority = {
      activity: activityValue,
      hours: hoursValue
    };
    db.collection("priorities")
      .add(priority)
      .then(res => {
        activityInput.value = "";
        activityHours.value = "";
        activityInput.focus();
      });
    //chart.load(data);
  } else {
    e.preventDefault();
    errorField.textContent = "FILL IT IN RIGHT, FOOL!";
  }
});

db.collection("priorities").onSnapshot(res => {
  res.docChanges().forEach(change => {
    const doc = [
      change.doc.data().activity,
      change.doc.data().hours,
      change.doc.id
    ];
    console.log(doc);
    switch (change.type) {
      case "added":
        data.columns.push(doc);
        //firebaseData.push(doc);
        //chart.load(data);
        break;
      case "modified":
        const index = data.columns.findIndex(item => item[2] == doc[2]);
        data.columns[index] = doc;
        //firebaseData[index] = doc;
        //chart.load(data);
        break;
      case "removed":
        const removed = data.columns.filter(item => item[2] === doc[2]);
        console.log(removed);
        chart.unload(removed[0]);

        const updated = data.columns.filter(item => {
          //console.log(JSON.stringify(item[2]) !== JSON.stringify(doc[2]));
          return item[2] !== doc[2];
          //JSON.stringify(item[2]) !== JSON.stringify(doc[2]);
        });
        console.log(updated);
        data.columns = updated;

        break;
      default:
        break;
    }
  });
  if (!data.columns.length) {
    //chart.destroy();
    //chart.flush();
    chart.load(data);
  } else {
    //chart.destroy();
    chart.load(data);
  }
});
