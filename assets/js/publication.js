function listPapers(mainContain, featured) {
    var publicationArea = mainContain.selectAll('div.pubYear').selectAll('div.publicationArea').data(d => d.values)
        .enter().append('div').attr('class', 'row')
        // .append('table').style('width', '100%').style('margin-left', () => (featured) ? '0px' : '20px')
        // .append('tr');

    publicationArea.append('div')
		.attr("class", "publicationImage col-sm-3")
        .append("a").attr("class", "anchorPaperImage")
        .attr('href', d => getPDF(featured, d.pdf))
        .append('img').attr("class", "paperImage")
        .attr('src', d => featured ? "assets/" + d.image : "../assets/" + d.image);

    publicationArea.append('div')
		.attr("class", "paperDetail col-sm-9")
        .html(d => `
                        <a class="title" href="${getPDF(featured, d.pdf)}">${d.Title}</a>
                        <div>${highlightH(arraytoAuthor(d.Authors))}</div>
                        <div class="venue">${getVenue(featured, d.Venue)}</div>
                        <div class="award"> ${d.Award? `🏆 ${d.Award}` : ''}</div>

						<div class="helper">
                        ${d.pdf !== '' ? `[ <a href="${getPDF(featured, d.pdf)}"> PDF</a>` : ''}
                        ${d.doi !== '' ? ` | <a href="${d.doi}"> DOI</a>` : ''}
                        ${d.video !== '' ? ` | <a href="${d.video}"> Video</a>` : ''}
                        ${d.github !== '' ? ` | <a href="${d.github}"> GitHub</a>` : ''}
                        ${d.Demo !== '' ? ` | <a href="${d.Demo}"> Demo</a>` : ''}
                        ${!!d.Example ? ` | <a href="${d.Example}"> Examples</a>` : ''}
                        ${d.bib !== '' ? ` | <a href="${featured ?"assets/" + d.bib : "../assets/" + d.bib}"> BibTex</a>` : ''} ]</div>`)
	;



    function arraytoAuthor(a) {
        var lasta = a.pop();
        if (a.length) {
            return a.join(', ') + ' and ' + lasta;
        }
        return lasta;
    }

    function highlightH(authors) {
        // return authors.replace("Huyen Nguyen", "Huyen N. Nguyen");
		return authors.replace("Huyen Nguyen", "<u>Huyen N. Nguyen</u>");
    }

    function getPDF(featured, pdf) {
        if ((pdf.startsWith("papers/")) && (!featured)) {            // local + not feature
            return "../assets/" + pdf
        } else if ((pdf.startsWith("papers/")) && (featured)) {      // local + feature
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

        const minYear = 2018;

        let datapub = data_.filter(d => new Date(d.Time).getFullYear() >= minYear);
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

		var dataByYear = d3.nest().key(k => Number.isInteger(parseInt(k.Highlight))).entries(featuredData);

		// append pubs by year
		var mainContain = d3.select('#featuredPaperContainer');
		var yearContain_i = mainContain.selectAll('div.pubYear').data(dataByYear, d => d.key);

		yearContain_i.exit().remove();
		var yearContain = yearContain_i
			.enter().append('div').attr('class', 'pubYear');

		listPapers(mainContain, true)

	});
}
