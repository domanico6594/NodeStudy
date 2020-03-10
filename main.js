var http = require('http');
var fs = require('fs');
var url = require('url');

var app = http.createServer(function(request, response) {
	var _url = request.url;
	var queryData = url.parse(_url, true).query;
	var title = queryData.id;
	var pathName = url.parse(_url, true).pathname;

	if (pathName === '/') {
		fs.readFile(`data/${title}`, 'utf8', function(err, description) {
			var tmeplate = `<!doctype html>
		<html>
		<head>
			<title>WEB1 - ${title}</title>
			<meta charset="utf-8">
			<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		</head>
		
		<body>
			<h1><a href="/">WEB</a></h1>
			<input id="night_day" type="button" value="night" onclick="
			nightDayHandler(this);
		  ">
			<ul>
				<li><a href="/?id=HTML">HTML</a></li>
				<li><a href="/?id=CSS">CSS</a></li>
				<li><a href="/?id=JavaScript">JavaScript</a></li>
			</ul>
			<h2>${title}</h2>
			<p>
				${description}
			</p>			
		</body>
		
		</html>`;
			response.writeHead(200);
			console.log(pathName);
			response.end(tmeplate);
		});
	} else {
		response.writeHead(404);
		response.end('Not Found');
	}
});
app.listen(3000);
