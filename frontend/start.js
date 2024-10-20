window.onload = function() {
    fetch('http://127.0.0.1:3000/get-random-image')
        .then(response => response.json())
        .then(data => {
            const clientImagePath = data.imagePath;
            const imageElement = document.getElementById('random-image');
            imageElement.src = clientImagePath;
            window.selectedImagePath = clientImagePath;
        })
        .catch(error => {
            console.error('Error fetching random image:', error);
        });
};

let scoreText = {};
let poemText = '';

async function fetchComparisonData() {

    const userInput = document.getElementById("userpoeminput").value;
    const clientImagePath = window.selectedImagePath; 
    const imagePath = clientImagePath.substring(1); 
  
    try {
      const response = await fetch('http://127.0.0.1:3000/get-comparison', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          poem: userInput,
          imagePath: imagePath
        })
      });
  
      const data = await response.json(); 
  
      scoreText = data.formattedData;

      poemText = data.AIPoem;

    } catch (error) {
      console.error("An error occurred while fetching comparison data:", error);
    } 
} 


const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
            entry.target.classList.add('show');
        } 
        else{
            entry.target.classList.remove('show');
        }
        });
    });


async function scrollDown(){
    await fetchComparisonData(); 
    let proseScore = scoreText.poem_1.prose; 

    const resultsDiv = document.getElementById("comparison-results");
    resultsDiv.innerHTML = ` 

    <div class="bigbox"> 
            <h2 class="AIspoem">AI-generated Poem</h2>
            <p class="AIpoem">${poemText}</p>
        </div>
        <div class="bigbox">
            <table class="table1">
            <h2 class="scoring">Scoring</h2>
                <thead>
                    <tr>
                        <th></th>
                        <th >Your Poem</th>
                        <th >AI's Poem</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td class="bold">Creativity</td>
                        <td>${scoreText.poem_1.creativity}</td>
                        <td>${scoreText.poem_2.creativity}</td>
                    </tr>
                    <tr>
                        <td class="bold">Originality</td>
                        <td>${scoreText.poem_1.originality}</td>
                        <td>${scoreText.poem_2.originality}</td>
                    </tr>
                    <tr>
                        <td class="bold">Prose</td>
                        <td>${scoreText.poem_1.prose}</td>
                        <td>${scoreText.poem_2.prose}</td>
                    </tr>
                    <tr>
                        <td class="bold">Personal Meaning</td>
                        <td>${scoreText.poem_1.personal_meaning}</td>
                        <td>${scoreText.poem_2.personal_meaning}</td>
                    </tr>
                    <tr>
                        <td class="bold">Overall</td>
                        <td>${scoreText.poem_1.overall}</td>
                        <td>${scoreText.poem_2.overall}</td>
                    </tr>
                </tbody>
            </table>

            <p>${scoreText.advice}</p>
        </div>

        
    `;
    resultsDiv.scrollIntoView({behavior: 'smooth'});

    setTimeout(function(){
        const hiddenElements = resultsDiv.querySelectorAll('.hidden');
        hiddenElements.forEach((el) => observer.observe(el));
        
    },2000);

}

document.getElementById("submitbtn").addEventListener("click", function(){
    document.querySelector('.spinner').style.display = 'block';

    setTimeout(function(){
        document.querySelector('.spinner').style.display = 'none';

        scrollDown();
    },3000);
    });

function startOver(){
    document.getElementById('userpoeminput').value = '';
    regenerateImage();
    document.getElementById('comparison-results').innerHTML = '';
}

function regenerateImage() {
    fetch('http://127.0.0.1:3000/get-random-image')
        .then(response => response.json())
        .then(data => {
            const clientImagePath = data.imagePath;
            const imageElement = document.getElementById('random-image');
            imageElement.src = clientImagePath;
            window.selectedImagePath = clientImagePath; 
        })
        .catch(error => {
            console.error('Error fetching new image:', error);
        });
}