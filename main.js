var http = require('http');
var fs = require('fs');
var url = require('url');

function templateHTML(title, list, body) {
	return `<!doctype html>
		<html>
		<head>
			<title>WEB1 - ${title}</title>
			<meta charset="utf-8">
			<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		</head>
		
		<body>
			<h1><a href="/">WEB</a></h1>
			${list}
			${body}		
		</body>
		
		</html>
		
		`;
}

function templateList(filelist) {
	var list = '<ul>';
	var i = 0;
	while (i < filelist.length) {
		list =
			list + `<li><a href="/?id=${filelist[i]}">${filelist[i]}</a></li>`;
		i = i + 1;
	}
	list = list + '</ul>';
	return list;
}

var app = http.createServer(function (request, response) {
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	var title = queryData.id;
	var pathName = url.parse(_url, true).pathname;

	if (pathName === '/') {
		if (queryData.id === undefined) {
			fs.readdir('./data', function (error, filelist) {
				title = 'Welcome!';
				description = 'Hello Node js!';
				var list = templateList(filelist);
				var template = templateHTML(
					title,
					list,
					`<h2>${title}</h2>
				<p> 
				${description}
				</p>`
				);
				response.writeHead(200);
				response.end(template);
			});
		} else {
			fs.readdir('./data', function (error, filelist) {
				var list = templateList(filelist);
				fs.readFile(`data/${title}`, 'utf8', function (
					err,
					description
				) {
					var template = templateHTML(
						title, list, `<h2>${title}</h2>
						<p> 
						${description}
						</p>`
					);
					response.writeHead(200);
					response.end(template);
				});
			});
		}
	} else {
		response.writeHead(404);
		response.end('Not Found');
	}
});
app.listen(3000);