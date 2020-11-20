const fs = require('fs');
const parseTorrent = require('parse-torrent');
const path = require("path")
const filterFileType = ['txt', 'jpg'];
const newDirName = 'formatFile'; // 移动目标文件名
const newDirPath = path.resolve(__dirname + '/' + newDirName); // 新的文件路径
const rootRealPath = path.resolve(__dirname);
const targetFileName = '';
const unTargetFileName = '_______________________________________';

main();

// 判断目标文件夹中是否有相同名称的文件
function checkHasFile(filePath, file) {
	var pa = fs.readdirSync(filePath);
	if (!pa || pa.length === 0) {
		return false;
	}
	return (pa.indexOf(file) !== -1);
}

function createNewDir() {
	// 如果页面中没有 newFile 那么直接创建
	if (!checkHasFile(rootRealPath, newDirName)) {
		console.log(`如果没有${newDirName}文件夹 那么直接创建一个文件夹`);
		fs.mkdirSync(rootRealPath + '/' + newDirName);
	}
}

function main() {
	const rootRealPath = path.resolve(__dirname);
	console.log('文件路径为===>', rootRealPath);
	const formatFileNum = 0; // 格式化的文件总数
	const formatFileTypes = ['txt']; // 需要过滤出来的文件类型
	createNewDir();
	readDirSync(rootRealPath);

	function readDirSync(dirPath) {
		const pa = fs.readdirSync(dirPath);
		console.log(dirPath);
		for (let i in pa) {
			// 文件
			let ele = pa[i];
			let index = i;
			var info = fs.statSync(dirPath + "/" + ele); // 判断是文件夹 还是文件
			const filePath = dirPath + "/" + ele;
			if (info.isDirectory() && ele !== newDirName) {
				console.log('info=========', info, ele);
				// 递归遍历所有文件夹, 将文件夹中的文件取出
				readDirSync(dirPath + "/" + ele);
			} else {
				var splitArea = ele.split('.');
				var fileName = splitArea.slice(0, -1); // 不带有格式的文件名
				var fileType = splitArea.slice(-1)[0]; // 文件格式
				console.log('文件列表====>', );
				// 如果是torrent文件
				if (fileType === 'torrent') {
					const torrentFileInfo = parseTorrent(fs.readFileSync(filePath));
					let BaseFileInfo = torrentFileInfo.info;
					BaseFileInfo.files.map((file) => {
						// console.log('item===========>', file);
						file.path.map((path, idx) => {
							const fileType = path.toString().split('.').slice(-1)[0];
							if (filterFileType.indexOf(fileType)!==-1) {
								file.path[idx] = targetFileName + path;
							} else {
								file.path[idx] = unTargetFileName + '.' + fileType
							}
							return path;
						});
						file['path.utf-8'].map((path, idx) => {
							const fileType = path.toString().split('.').slice(-1)[0];
							if (filterFileType.indexOf(fileType)!==-1) {
								file['path.utf-8'][idx] = targetFileName + path;
							} else {
								file['path.utf-8'][idx] = unTargetFileName + '.' + fileType;
							}
							return path;
						});
						// console.log('file path====>', file)
						return file;
					});
					// BaseFileInfo = renameFile(BaseFileInfo);
					createNewFile(newDirPath, ele, BaseFileInfo);

					// console.log('files=========>', newDirPath, ele, BaseFileInfo, BaseFileInfo.files);

				} else {
					// console.log('不是对应文件 不进行操作', fileName, fileType);
				}

			}
		}
	}
}

// 创建新的文件信息
function createNewFile(filePath, fileName, info) {
	var buf = parseTorrent.toTorrentFile({
		info: info
	});
	const filePosition = filePath + "\\" + fileName;
	fs.writeFileSync(filePosition, buf, () => {
		console.log('文件写入失败!')
	});
	console.log('文件筛选成功 写入文件===>', filePosition);
}