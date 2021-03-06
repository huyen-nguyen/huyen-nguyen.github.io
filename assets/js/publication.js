function listPapers(mainContain, featured) {
    var publicationArea = mainContain.selectAll('div.pubYear').selectAll('div.publicationArea').data(d => d.values)
        .enter().append('div').attr('class', 'publicationArea')
        .append('table').style('width', '100%').style('margin-left', () => (featured) ? '0px' : '20px')
        .append('tr');
    publicationArea.append('th').attr("class", "th-image").attr('width', '15%')
        .append("a").attr("class", "anchorPaperImage")
        .attr('href', d => getPDF(featured, d.pdf))
        .append('img').attr("class", "paperImage")
        .attr('src', d => featured ? "assets/" + d.image : "../assets/" + d.image).attr('width', 190).attr('height', 110);

    publicationArea.append('th').attr("class", "paperDetail").attr('width', '85%')
        .html(d => `
                        <h5><a class="paperTitle non-deco" href="${getPDF(featured, d.pdf)}">${d.Title}</a></h5>
                        <p>${highlightH(arraytoAuthor(d.Authors))}</p>
                        <p class="venue">${d.doi !== '' ? `<a href="${d.doi}">${getVenue(featured, d.Venue)} </a>` : getVenue(featured, d.Venue)}</p>
                        <p class="award"> ${d.Award !== '' ? `<i class="fas fa-award" style="color: #ed9f04; font-weight: bold"></i> ${d.Award}<br>` : ''}</p>
                        ${d.pdf !== '' ? `<a href="${getPDF(featured, d.pdf)}"><i class="far fa-file-pdf" aria-hidden="true"></i> PDF</a>` : ''}
                        ${d.doi !== '' ? `<a href="${d.doi}"><i class="fas fa-link" aria-hidden="true"></i> DOI</a>` : ''}
                        ${d.video !== '' ? `<a href="${d.video}"><i class="fas fa-film" aria-hidden="true"></i></i> Video</a>` : ''}
                        ${d.github !== '' ? `<a href="${d.github}"><i class="fab fa-github" aria-hidden="true"></i> GitHub</a>` : ''}
                        ${d.Demo !== '' ? `<a href="${d.Demo}"><i class="far fa-play-circle" aria-hidden="true"></i> Demo</a>` : ''}
                        ${d.Example !== '' ? `<a href="${d.Example}"><i class="fas fa-th" aria-hidden="true"></i> Examples</a>` : ''}
                        ${d.bib !== '' ? `<a href="${featured ?"assets/" + d.bib : "../assets/" + d.bib}"> <i class="fas fa-book" aria-hidden="true"></i> BibTex</a>
                        <br><br>` : ''}`);


    function arraytoAuthor(a) {
        var lasta = a.pop();
        if (a.length) {
            return a.join(', ') + ' and ' + lasta;
        }
        return lasta;
    }

    function highlightH(authors) {
        return authors.replace("Huyen Nguyen", "<b>Huyen N. Nguyen</b>");
    }

    // function getPDF(featured, pdf) {
    //     if ((pdf.startsWith("papers/")) && (!featured)) {
    //         console.log("feature + local")
    //         return "../assets/" + pdf
    //     } else {
    //         console.log("feature + online")
    //         return "assets/"+pdf
    //     }
    // }

    function getPDF(featured, pdf) {
        if ((pdf.startsWith("papers/")) && (!featured)) {            // local + not feature
            console.log("feature + local")
            return "../assets/" + pdf
        } else if ((pdf.startsWith("papers/")) && (featured)) {      // local + feature
            console.log("feature + online")
            return "assets/"+pdf
        }
        else {                                                          // online
            return pdf
        }

    }

    function getVenue(featured, venue) {
        let short = venue.split("|")[1];
        return featured ? (short ? short : venue) : (venue)
    }
}


function publications() {
    d3.tsv("../assets/data/publications.tsv", function (error, data_) {
        if (error) throw error;

        var minYear = 2018;

        datapub = data_.filter(d => new Date(d.Time).getFullYear() >= minYear);
        // preprocess
        datapub.forEach(d => {
            d.Time = new Date(d.Time);
            d.Authors = d.Authors.split(',').map(n => n.trim());
        });
        datapub.sort((a, b) => b.Time - a.Time);

        yearNestPaper(datapub);
    });
}

function yearNestPaper(data) {
// seperate year
    var dataByYear = d3.nest().key(k => k.Time.getFullYear()).sortKeys((a, b) => b - a).entries(data);

    // console.log(dataByYear)

    // append pubs by year
    var mainContain = d3.select('#paperContainer');
    var yearContain_i = mainContain.selectAll('div.pubYear').data(dataByYear, d => d.key);

    yearContain_i.exit().remove();
    var yearContain = yearContain_i
        .enter().append('div').attr('class', 'pubYear');

    // each header
    yearContain.append('br');
    yearContain.append('span').html(d => `<h3>${d.key}</h3>`);
    yearContain.append('hr')

    listPapers(mainContain, false)

}

function featuredPublications() {
    d3.tsv("assets/data/publications.tsv", function (error, data_) {
        if (error) throw error;

        var minYear = 2018;

        datapub = data_.filter(d => new Date(d.Time).getFullYear() >= minYear);
        // preprocess
        datapub.forEach(d => {
            d.Time = new Date(d.Time);
            d.Authors = d.Authors.split(',').map(n => n.trim());
        });
        let featuredData = datapub.filter(d => parseInt(d.Highlight) > 0).sort((a, b) => a.Highlight - b.Highlight);

        featuredNestPaper(featuredData);
    });
}

function featuredNestPaper(data) {
    var dataByYear = d3.nest().key(k => Number.isInteger(parseInt(k.Highlight))).entries(data);

    // append pubs by year
    var mainContain = d3.select('#featuredPaperContainer');
    var yearContain_i = mainContain.selectAll('div.pubYear').data(dataByYear, d => d.key);

    yearContain_i.exit().remove();
    var yearContain = yearContain_i
        .enter().append('div').attr('class', 'pubYear');

    listPapers(mainContain, true)
}