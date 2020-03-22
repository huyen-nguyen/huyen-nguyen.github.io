d3.csv('data/publications.csv', function (error, data) {
    if (error) throw error;

    console.log(data);
    listPublications(data)

});

function listPublications(data) {
    d3.select("#paperContainer")
        .selectAll(".publication")
        .data(data)
        .enter()
        .append("div")
        .attr("class","publication")
        .attr("text-color", "black")
        .text(d => d.title)

    let dataByYear = d3.nest().key(k => k.time.getFullYear()).sortKeys((a, b) => b - a).entries(data);

    console.log(dataByYear);
}