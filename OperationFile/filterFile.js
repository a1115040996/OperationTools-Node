const fs = require("fs")
const path = require("path")

main();

function main() {
	const rootRealPath = path.resolve(__dirname);
	const newDirName = 'newFile'; // 移动目标文件名
	const newDirPath = path.resolve(__dirname + '/' + newDirName); // 新的文件路径
	const filterFormatList = ['txt']; // 位移的文件后缀名
	const notFilterNames = [newDirName, 'filterFile.js']; // 不进行位移的文件 或者文件夹 或 文件格式
	let moveFileCount = 0; // 位移文件总数
	let eachFileCount = 0; // 遍历文件总数

	// 如果页面中没有 newFile 那么直接创建
	if (!checkHasFile(rootRealPath, newDirName)) {
		console.log(`如果没有${newDirName}文件夹 那么直接创建一个文件夹`);
		fs.mkdirSync(newDirName);
	}
	readDirSync(rootRealPath);
	console.log(`任务执行完成  操作文件总数为: ${eachFileCount} 位移文件总数为: ${moveFileCount}`);

	function readDirSync(filePath) {
		const pa = fs.readdirSync(filePath);

		for (let i in pa) {
			let ele = pa[i];
			let index = i;
			if (notFilterNames.indexOf(ele) !== -1) { // 如果是位移后目标文件夹 则不进行操作
				continue;
			}
			var info = fs.statSync(filePath + "/" + ele); // 判断是文件夹 还是文件
			if (info.isDirectory()) {
				// 递归遍历所有文件夹, 将文件夹中的文件取出
				readDirSync(filePath + "/" + ele);
			} else {
				var splitArea = ele.split('.');
				var fileName = splitArea.slice(0, -1); // 不带有格式的文件名
				var fileFormat = splitArea.slice(-1); // 文件格式
				eachFileCount++;
				if (filterFormatList.indexOf(splitArea[splitArea.length - 1]) !== -1) {
					moveFileCount++;
					if (checkHasFile(newDirPath, ele)) {
						fs.renameSync(path.resolve(`${filePath}/${ele}`), path.resolve(`${newDirPath}/${fileName}_${(new Date()).getTime()}.${fileFormat}`));
						console.log('加时间戳 然后移动', ele);
					} else {
						console.log('没有同名文件 直接移动', ele);
						fs.renameSync(path.resolve(filePath + "/" + ele), path.resolve(newDirPath + '/' + ele));
					}
				} else {
					console.log('非 位移文件 不进行位移');
				}

			}
		}
	}

}

// 判断目标文件夹中是否有相同名称的文件
function checkHasFile(filePath, file) {
	var pa = fs.readdirSync(filePath);
	if (!pa || pa.length === 0) {
		return false;
	}
	return (pa.indexOf(file) !== -1);
}