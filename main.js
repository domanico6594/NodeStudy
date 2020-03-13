var http = require('http');
var fs = require('fs');
var url = require('url');
var qs = require('querystring');

function templateHTML(title, list, body, control) {
	return `<!doctype html>
		<html>
		<head>
			<title>WEB2! - ${title}</title>
			<meta charset="utf-8">
			<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.2.1/jquery.min.js"></script>
		</head>
		
		<body>
			<h1><a href="/">WEB2</a></h1>
			${list}
			${control}
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
				</p>`, `<a href="/create">Create</a>`
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
						</p>`, `<a href="/create">Create</a> <a href="/update?id=${title}">Update</a>
						<form action ="delete_process" method="post" onsubmit="">
							<input type="hidden" name="id" value="${title}">
							<input type="submit" value ="Delete">
						</form>`
					);
					response.writeHead(200);
					response.end(template);
				});
			});
		}
	} else if (pathName === '/create') {
		fs.readdir('./data', function (error, filelist) {
			title = 'Welcome!';
			description = 'Hello Node js!';
			var list = templateList(filelist);
			var template = templateHTML(
				title,
				list,
				`<form action="/create_process" method="POST">

				<p><input type="text" name="title" placeholder="Title"></p>
				<p>
					<textarea name="description" placeholder="Description"></textarea>
				</p>
				<p>
					<input type="submit">
				</p>
			
			</form>`, ``
			);
			response.writeHead(200);
			response.end(template);
		});
	} else if (pathName === '/create_process') {
		var body = '';
		request.on('data', (data) => {
			body = body + data;
		})
		request.on('end', () => {
			var post = qs.parse(body);
			var title = post.title;
			var description = post.description;
			fs.writeFile(`Data/${title}`, description, 'utf8', (err) => {
				response.writeHead(302, {
					Location: `/?id=${title}`
				});
				response.end();
			});
		});
	} else if (pathName === '/update') {
		fs.readdir('./data', function (error, filelist) {
			var list = templateList(filelist);
			fs.readFile(`data/${title}`, 'utf8', function (
				err,
				description
			) {
				var template = templateHTML(
					title, list, `<h2>${title}</h2>
					<p> 
					<form action="/update_process" method="POST">
					<input type="hidden" name="id" value="${title}">
				<p><input type="text" name="title" placeholder="Title" value="${title}"></p>
				<p>
					<textarea name="description" placeholder="Description" >${description}</textarea>
				</p>
				<p>
					<input type="submit">
				</p>
			
			</form>
					</p>`, `<a href="/create">Create</a> <a href="/update?id=${title}">Update</a>`
				);
				response.writeHead(200);
				response.end(template);
			});
		});
	} else if (pathName === '/update_process') {
		var body = '';
		request.on('data', (data) => {
			body = body + data;
		})
		request.on('end', () => {
			var post = qs.parse(body);
			let id = post.id;
			var title = post.title;
			var description = post.description;
			fs.rename(`data/${id}`, `data/${title}`, (err) => {

			});
			console.log(post);

			// fs.writeFile(`Data/${title}`, description, 'utf8', (err) => {
			// 	response.writeHead(302, {
			// 		Location: `/?id=${title}`
			// 	});
			// 	response.end();
			// });
		});
	} else if (pathName === '/delete_process') {
		var body = '';
		request.on('data', (data) => {
			body = body + data;
		})
		request.on('end', () => {
			var post = qs.parse(body);
			let id = post.id;
			fs.unlink(`data/${id}`, () => {
				response.writeHead(302, {
					Location: `/`
				});
				response.end();
			})
		});
	} else {
		response.writeHead(404);
		response.end('Not Found');
	}
});
app.listen(3000);