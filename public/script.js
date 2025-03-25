function calculate() {
    const num1 = document.getElementById("num1").value;
    const num2 = document.getElementById("num2").value;
    const operation = document.getElementById("operation").value;

    fetch(`/${operation}?num1=${num1}&num2=${num2}`)
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                document.getElementById("result").textContent = `Error: ${data.error}`;
            } else {
                document.getElementById("result").textContent = `Result: ${data.result}`;
            }
        })
        .catch(error => console.error("Error:", error));
}
