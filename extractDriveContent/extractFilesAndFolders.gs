function onOpen() {
  var SS = SpreadsheetApp.getActiveSpreadsheet();
  var ui = SpreadsheetApp.getUi();
  ui.createMenu("List Files/Folders")
    .addItem("List All Files", "listFiles")
    .addItem("List All Folders", "listFolders")
    .addSeparator()
    .addItem("List All Files and Folders", "listFilesAndFolders")
    .addToUi();
}
function getId() {
  var folderId = Browser.inputBox("Enter folder ID", Browser.Buttons.OK_CANCEL);
  return folderId;
}
function checkValidity(folderId) {
  if (folderId === "") {
    Browser.msgBox("Folder ID is invalid");
    return;
  }
}
function listFilesAndFolders() {
  var folderId = getId();
  checkValidity(folderId);
  getFolderTree(folderId, true, true); //id , listfile, listfolder
}
function listFiles() {
  var folderId = getId();
  checkValidity(folderId);
  getFolderTree(folderId, true, false); //id , listfile, listfolder
}
function listFolders() {
  var folderId = getId();
  checkValidity(folderId);
  fileType = 0;
  getFolderTree(folderId, false, true); //id , listfile, listfolder
}
// Get Folder Tree
function getFolderTree(folderId, listFile, listFolder) {
  try {
    // Get folder by id
    var parentFolder = DriveApp.getFolderById(folderId);
    // Initialise the sheet
    var file,
      data,
      sheet = SpreadsheetApp.getActiveSheet();
    sheet.clear();
    sheet.appendRow(["Full Path", "Name", "Type", "URL"]);
    // Get files and folders
    getChildFolders(
      parentFolder.getName(),
      parentFolder,
      data,
      sheet,
      listFile,
      listFolder
    );
  } catch (e) {
    Logger.log(e.toString());
  }
}
// Get the list of files and folders and their metadata in recursive mode
function getChildFolders(
  parentName,
  parent,
  data,
  sheet,
  listFile,
  listFolder
) {
  var childFolders = parent.getFolders();
  // List folders inside the folder
  while (childFolders.hasNext()) {
    var childFolder = childFolders.next();
    var folderId = childFolder.getId();
    data = [
      parentName + "/" + childFolder.getName(),
      childFolder.getName(),
      "Folder",
      childFolder.getUrl(),
    ];
    // Write Folder
    if (listFolder == true) {
      sheet.appendRow(data);
    }
    // List files inside the folder
    if (listFile == true) {
      var files = childFolder.getFiles();
      while (files.hasNext()) {
        var childFile = files.next();
        data = [
          parentName + "/" + childFolder.getName() + "/" + childFile.getName(),
          childFile.getName(),
          "Files",
          childFile.getUrl(),
        ];
        // Write File
        sheet.appendRow(data);
      }
    }
    // Recursive call of the subfolder
    getChildFolders(
      parentName + "/" + childFolder.getName(),
      childFolder,
      data,
      sheet,
      listFile,
      listFolder
    );
  }
}
