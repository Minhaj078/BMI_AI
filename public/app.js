const form = document.querySelector("form");

form.addEventListener("submit", async function (e) {
  e.preventDefault();

  const height = parseInt(document.querySelector("#height").value);
  const weight = parseInt(document.querySelector("#weight").value);
  const results = document.querySelector("#result");

  if (isNaN(height) || height <= 0 || isNaN(weight) || weight <= 0) {
    results.textContent = "Please provide valid height and weight.";
    return;
  }

  const bmi = (weight / ((height * height) / 10000)).toFixed(2);
  let category = "";

  if (bmi < 18.6) {
    category = "Underweight";
  } else if (bmi >= 18.6 && bmi <= 24.9) {
    category = "Normal";
  } else {
    category = "Overweight";
  }

  results.innerHTML = `Your BMI is <strong>${bmi}</strong> (${category}).`;

  document.querySelector("#ai-section").style.display = "block";
  document.querySelector("#ai-response").textContent = "🤖 Thinking...";

  const advice = await getAIAdvice(bmi, category);

  document.querySelector("#ai-response").textContent = advice;
});

async function getAIAdvice(bmi, category) {
  try {
    const response = await fetch("http://localhost:3000/bmi-advice", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ bmi, category }),
    });

    const data = await response.json();
    return data.advice || "Sorry, could not generate advice.";
  } catch (error) {
    console.error("AI fetch error:", error);
    return "⚠️ AI service is currently unavailable.";
  }
}
