// // Function to generate table rows
// function generateTable(leaderboardData) {
//     const tbody = document.querySelector('#leaderboard tbody');

//     // Collect the values from each column for comparison
//     let soundMiniValues = [], soundTestValues = [];
//     let musicMiniValues = [], musicTestValues = [];
//     let speechMiniValues = [], speechTestValues = [];
//     let avgMiniValues = [], avgTestValues = [];

//     leaderboardData.leaderboardData.forEach(entry => {
//         soundMiniValues.push(parseFloat(entry.Sound["Test-mini"]));  // Parse as float for accurate comparison
//         soundTestValues.push(parseFloat(entry.Sound["Test"]));
//         musicMiniValues.push(parseFloat(entry.Music["Test-mini"]));
//         musicTestValues.push(parseFloat(entry.Music["Test"]));
//         speechMiniValues.push(parseFloat(entry.Speech["Test-mini"]));
//         speechTestValues.push(parseFloat(entry.Speech["Test"]));
//         avgMiniValues.push(parseFloat(entry.Avg["Test-mini"]));
//         avgTestValues.push(parseFloat(entry.Avg["Test"]));
//     });

//     // Function to get the highest and second highest values
//     function getTopTwoValues(values) {
//         // Exclude the first three rows and work with the rest
//         let filteredValues = values.slice(5);  // Skip the first three elements
//         let sorted = [...filteredValues].filter(v => !isNaN(v)).sort((a, b) => b - a);
//         return [sorted[0], sorted[1]];  // Highest and second-highest
//     }
//     // function getTopTwoValues(values) {
//     //     let sorted = [...values].filter(v => !isNaN(v)).sort((a, b) => b - a);
//     //     return [sorted[0], sorted[1]];  // Highest and second-highest
//     // }

//     // Get top two values for each column
//     const [soundMiniTop, soundMiniSecond] = getTopTwoValues(soundMiniValues);
//     const [soundTestTop, soundTestSecond] = getTopTwoValues(soundTestValues);
//     const [musicMiniTop, musicMiniSecond] = getTopTwoValues(musicMiniValues);
//     const [musicTestTop, musicTestSecond] = getTopTwoValues(musicTestValues);
//     const [speechMiniTop, speechMiniSecond] = getTopTwoValues(speechMiniValues);
//     const [speechTestTop, speechTestSecond] = getTopTwoValues(speechTestValues);
//     const [avgMiniTop, avgMiniSecond] = getTopTwoValues(avgMiniValues);
//     const [avgTestTop, avgTestSecond] = getTopTwoValues(avgTestValues);

//     leaderboardData.leaderboardData.forEach(entry => {
//         const row = document.createElement('tr');

//         if (entry.info.type === 'human_expert') {
//             row.classList.add('human_expert');
//         } else if (entry.info.type === 'open_source') {
//             row.classList.add('open_source');
//         } else if (entry.info.type === 'proprietary') {
//             row.classList.add('proprietary');
//         }
        
//         // Name with optional link
//         let nameCell = `<td>${entry.info.link ? `<a href="${entry.info.link}">${entry.info.name}</a>` : entry.info.name}</td>`;
        
//         // Size
//         let sizeCell = `<td>${entry.info.size}</td>`;

//         // Helper function to format the values
//         function formatValue(value, top, secondTop) {
//             if (value === top) return `<b>${value}</b>`;
//             if (value === secondTop) return `<u>${value}</u>`;
//             return value || '-';
//         }

//         // Sound, Music, Speech, Avg (Test-mini and Test)
//         let soundMini = `<td>${formatValue(parseFloat(entry.Sound["Test-mini"]), soundMiniTop, soundMiniSecond)}</td>`;
//         let soundTest = `<td>${formatValue(parseFloat(entry.Sound["Test"]), soundTestTop, soundTestSecond)}</td>`;
//         let musicMini = `<td>${formatValue(parseFloat(entry.Music["Test-mini"]), musicMiniTop, musicMiniSecond)}</td>`;
//         let musicTest = `<td>${formatValue(parseFloat(entry.Music["Test"]), musicTestTop, musicTestSecond)}</td>`;
//         let speechMini = `<td>${formatValue(parseFloat(entry.Speech["Test-mini"]), speechMiniTop, speechMiniSecond)}</td>`;
//         let speechTest = `<td>${formatValue(parseFloat(entry.Speech["Test"]), speechTestTop, speechTestSecond)}</td>`;
//         let avgMini = `<td>${formatValue(parseFloat(entry.Avg["Test-mini"]), avgMiniTop, avgMiniSecond)}</td>`;
//         let avgTest = `<td>${formatValue(parseFloat(entry.Avg["Test"]), avgTestTop, avgTestSecond)}</td>`;

//         // Append all cells into the row
//         row.innerHTML = `${nameCell}${sizeCell}${soundMini}${soundTest}${musicMini}${musicTest}${speechMini}${speechTest}${avgMini}${avgTest}`;
        
//         tbody.appendChild(row);
//     });
// }

function generateTable(leaderboardData) {
    const tbody = document.querySelector('#leaderboard tbody');
    tbody.innerHTML = ""; // Clear existing rows

    // Separate human_expert and random_guess entries from others
    const humanExperts = leaderboardData.leaderboardData.filter(entry => entry.info.type === 'human_expert');
    const randomGuesses = leaderboardData.leaderboardData.filter(entry => entry.info.type === 'random_guess');
    const others = leaderboardData.leaderboardData.filter(entry => 
        entry.info.type !== 'human_expert' && entry.info.type !== 'random_guess'
    );

    // Sort only the non-fixed entries based on Avg["Test"] in descending order
    others.sort((a, b) => {
        let avgA = parseFloat(a.Avg?.["Test"]) || 0;
        let avgB = parseFloat(b.Avg?.["Test"]) || 0;
        return avgB - avgA; // Sort descending
    });

    // Function to create and append table rows
    function appendRow(entry, isDivider = false) {
        const totalColumns = 10; // Adjust this based on the actual number of columns

        if (isDivider) {
            const dividerRow = document.createElement('tr');
            dividerRow.innerHTML = `<td colspan="${totalColumns}" style="border-bottom: 4px solid black;"></td>`;
            tbody.appendChild(dividerRow);
            return;
        }

        const row = document.createElement('tr');

        if (entry.info.type === 'human_expert') {
            row.classList.add('human_expert');
        } else if (entry.info.type === 'random_guess') {
            row.classList.add('random_guess');
        } else if (entry.info.type === 'open_source') {
            row.classList.add('open_source');
        } else if (entry.info.type === 'proprietary') {
            row.classList.add('proprietary');
        }

        // Assign medals to the top 3 performers in the sorted list (excluding fixed entries)
        let medal = "";
        if (entry.rank === 0) {
            medal = " 🥇";  // Gold Medal
        } else if (entry.rank === 1) {
            medal = " 🥈";  // Silver Medal
        } else if (entry.rank === 2) {
            medal = " 🥉";  // Bronze Medal
        }

        // Name with optional link
        let nameCell = `<td>${entry.info.link ? `<a href="${entry.info.link}">${entry.info.name}${medal}</a>` : entry.info.name + medal}</td>`;

        // Size
        let sizeCell = `<td>${entry.info.size || '-'}</td>`;

        // Sound, Music, Speech, Avg (Test-mini and Test)
        let soundMini = `<td>${entry.Sound?.["Test-mini"] || '-'}</td>`;
        let soundTest = `<td>${entry.Sound?.["Test"] || '-'}</td>`;
        let musicMini = `<td>${entry.Music?.["Test-mini"] || '-'}</td>`;
        let musicTest = `<td>${entry.Music?.["Test"] || '-'}</td>`;
        let speechMini = `<td>${entry.Speech?.["Test-mini"] || '-'}</td>`;
        let speechTest = `<td>${entry.Speech?.["Test"] || '-'}</td>`;
        let avgMini = `<td>${entry.Avg?.["Test-mini"] || '-'}</td>`;
        let avgTest = `<td>${entry.Avg?.["Test"] || '-'}</td>`;

        // Append all cells into the row
        row.innerHTML = `${nameCell}${sizeCell}${soundMini}${soundTest}${musicMini}${musicTest}${speechMini}${speechTest}${avgMini}${avgTest}`;

        tbody.appendChild(row);
    }

    // Append random guess entries first
    randomGuesses.forEach(entry => appendRow(entry));

    // Append human experts immediately after random guess (no separator)
    humanExperts.forEach(entry => appendRow(entry));

    // Insert a single bold line before sorted entries
    if (others.length > 0) {
        appendRow(null, true);
    }

    // Append sorted non-fixed entries
    others.forEach((entry, index) => {
        entry.rank = index; // Track index for medal assignment
        appendRow(entry);
    });
}



// Function to load JSON and then generate the table
function loadJSONAndGenerateTable() {
    fetch('./leaderboard_data.json')  // Replace this with the path to your JSON file
        .then(response => response.json())
        .then(data => generateTable(data))
        .catch(error => console.error('Error loading the JSON data:', error));
}

// Call the function on page load
document.addEventListener('DOMContentLoaded', loadJSONAndGenerateTable);





// // Function to generate table rows
// function generateTable(leaderboardData) {
//     const tbody = document.querySelector('#leaderboard tbody');
//     leaderboardData.leaderboardData.forEach(entry => {
//         const row = document.createElement('tr');
        
//         // Name with optional link
//         let nameCell = `<td>${entry.info.link ? `<a href="${entry.info.link}">${entry.info.name}</a>` : entry.info.name}</td>`;
        
//         // Size
//         let sizeCell = `<td>${entry.info.size}</td>`;
        
//         // Sound, Music, Speech, Avg (Test-mini and Test)
//         let soundMini = `<td>${entry.Sound["Test-mini"] || '-'}</td>`;
//         let soundTest = `<td>${entry.Sound["Test"] || '-'}</td>`;
//         let musicMini = `<td>${entry.Music["Test-mini"] || '-'}</td>`;
//         let musicTest = `<td>${entry.Music["Test"] || '-'}</td>`;
//         let speechMini = `<td>${entry.Speech["Test-mini"] || '-'}</td>`;
//         let speechTest = `<td>${entry.Speech["Test"] || '-'}</td>`;
//         let avgMini = `<td>${entry.Avg["Test-mini"] || '-'}</td>`;
//         let avgTest = `<td>${entry.Avg["Test"] || '-'}</td>`;

//         // Append all cells into the row
//         row.innerHTML = `${nameCell}${sizeCell}${soundMini}${soundTest}${musicMini}${musicTest}${speechMini}${speechTest}${avgMini}${avgTest}`;
        
//         tbody.appendChild(row);
//     });
// }

// // Function to load JSON and then generate the table
// function loadJSONAndGenerateTable() {
//     fetch('./leaderboard_data.json')  // Replace this with the path to your JSON file
//         .then(response => response.json())
//         .then(data => generateTable(data))
//         .catch(error => console.error('Error loading the JSON data:', error));
// }

// // Call the function on page load
// document.addEventListener('DOMContentLoaded', loadJSONAndGenerateTable);
