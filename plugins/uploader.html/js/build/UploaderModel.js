'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ('value' in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

var _get = function get(_x10, _x11, _x12) { var _again = true; _function: while (_again) { var object = _x10, property = _x11, receiver = _x12; _again = false; if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { _x10 = parent; _x11 = property; _x12 = receiver; _again = true; desc = parent = undefined; continue _function; } } else if ('value' in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } } };

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError('Cannot call a class as a function'); } }

function _inherits(subClass, superClass) { if (typeof superClass !== 'function' && superClass !== null) { throw new TypeError('Super expression must either be null or a function, not ' + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

(function (global) {
    var StatusItem = (function (_Observable) {
        _inherits(StatusItem, _Observable);

        function StatusItem(type) {
            _classCallCheck(this, StatusItem);

            _get(Object.getPrototypeOf(StatusItem.prototype), 'constructor', this).call(this);
            this._status = 'new';
            this._type = type;
            this._id = Math.random();
            this._errorMessage = null;
        }

        _createClass(StatusItem, [{
            key: 'getId',
            value: function getId() {
                return this._id;
            }
        }, {
            key: 'getLabel',
            value: function getLabel() {}
        }, {
            key: 'getType',
            value: function getType() {
                return this._type;
            }
        }, {
            key: 'getStatus',
            value: function getStatus() {
                return this._status;
            }
        }, {
            key: 'setStatus',
            value: function setStatus(status) {
                this._status = status;
                this.notify('status');
            }
        }, {
            key: 'updateRepositoryId',
            value: function updateRepositoryId(repositoryId) {
                this._repositoryId = repositoryId;
            }
        }, {
            key: 'getErrorMessage',
            value: function getErrorMessage() {
                return this._errorMessage || '';
            }
        }, {
            key: 'onError',
            value: function onError(errorMessage) {
                this._errorMessage = errorMessage;
                this.setStatus('error');
            }
        }, {
            key: 'process',
            value: function process(completeCallback) {
                this._doProcess(completeCallback);
            }
        }, {
            key: 'abort',
            value: function abort(completeCallback) {
                if (this._status !== 'loading') return;
                this._doAbort(completeCallback);
            }
        }]);

        return StatusItem;
    })(Observable);

    var UploadItem = (function (_StatusItem) {
        _inherits(UploadItem, _StatusItem);

        function UploadItem(file, targetNode) {
            var relativePath = arguments.length <= 2 || arguments[2] === undefined ? null : arguments[2];

            _classCallCheck(this, UploadItem);

            _get(Object.getPrototypeOf(UploadItem.prototype), 'constructor', this).call(this, 'file');
            this._file = file;
            this._status = 'new';
            this._progress = 0;
            this._targetNode = targetNode;
            this._repositoryId = global.pydio.user.activeRepository;
            this._relativePath = relativePath;
        }

        _createClass(UploadItem, [{
            key: 'getMqConfigs',
            value: function getMqConfigs() {
                return global.pydio.getPluginConfigs('mq');
            }
        }, {
            key: 'getFile',
            value: function getFile() {
                return this._file;
            }
        }, {
            key: 'getSize',
            value: function getSize() {
                return this._file.size;
            }
        }, {
            key: 'getLabel',
            value: function getLabel() {
                return this._relativePath ? this._relativePath : this._file.name;
            }
        }, {
            key: 'getProgress',
            value: function getProgress() {
                return this._progress;
            }
        }, {
            key: 'setProgress',
            value: function setProgress(newValue) {
                var bytes = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                this._progress = newValue;
                this.notify('progress', newValue);
                if (bytes !== null) {
                    this.notify('bytes', bytes);
                }
            }
        }, {
            key: 'getRelativePath',
            value: function getRelativePath() {
                return this._relativePath;
            }
        }, {
            key: 'buildQueryString',
            value: function buildQueryString() {

                var fullPath = this._targetNode.getPath();
                if (this._relativePath) {
                    fullPath += PathUtils.getDirname(this._relativePath);
                }
                var currentRepo = global.pydio.user.activeRepository;

                var queryString = '&get_action=upload&xhr_uploader=true&dir=' + encodeURIComponent(fullPath);

                var dataModel = global.pydio.getContextHolder();
                var nodeName = PathUtils.getBasename(this._file.name);
                var newNode = new AjxpNode(fullPath + "/" + nodeName);
                if (this._file.size) {
                    newNode.getMetadata().set("filesize", this._file.size);
                }
                try {
                    var params = null;
                    if (currentRepo !== this._repositoryId) {
                        params = { tmp_repository_id: this._repositoryId };
                    }
                    dataModel.applyCheckHook(newNode, params);
                } catch (e) {
                    throw new Error(global.pydio.MessageHash['html_uploader.3']);
                }
                var overwriteStatus = UploaderConfigs.getInstance().getOption("DEFAULT_EXISTING", "upload_existing");
                if (overwriteStatus === 'rename') {
                    queryString += '&auto_rename=true';
                } else if (overwriteStatus === 'alert' && !this._relativePath && currentRepo === this._repositoryId) {
                    if (dataModel.fileNameExists(nodeName, false, this._targetNode)) {
                        if (!global.confirm(global.pydio.MessageHash[124])) {
                            throw new Error(global.pydio.MessageHash[71]);
                        }
                    }
                }
                if (currentRepo !== this._repositoryId) {
                    queryString += '&tmp_repository_id=' + this._repositoryId;
                }
                return queryString;
            }
        }, {
            key: '_parseXHRResponse',
            value: function _parseXHRResponse() {
                if (!this.xhr) return;
                if (this.xhr.responseXML) {
                    var result = PydioApi.getClient().parseXmlMessage(this.xhr.responseXML);
                    if (!result) this.onError('Empty response');
                } else if (this.xhr.responseText && this.xhr.responseText != 'OK') {
                    this.onError('Unexpected response: ' + this.xhr.responseText);
                }
            }
        }, {
            key: '_doProcess',
            value: function _doProcess(completeCallback) {
                var complete = (function () {
                    this.setStatus('loaded');
                    this._parseXHRResponse();
                    completeCallback();
                }).bind(this);
                var error = (function () {
                    this.setStatus('error');
                    completeCallback();
                }).bind(this);
                var progress = (function (computableEvent) {
                    var percentage = Math.round(computableEvent.loaded * 100 / computableEvent.total);
                    var bytesLoaded = computableEvent.loaded;
                    this.setProgress(percentage, bytesLoaded);
                }).bind(this);

                this.setStatus('loading');

                var maxUpload = parseFloat(UploaderConfigs.getInstance().getOption('UPLOAD_MAX_SIZE'));

                var queryString = undefined;
                try {
                    UploaderConfigs.getInstance().extensionAllowed(this);
                    queryString = this.buildQueryString();
                } catch (e) {
                    this.onError(e.message);
                    completeCallback();
                    return;
                }

                // Checks applied.
                if (this.getMqConfigs().get('UPLOAD_ACTIVE')) {

                    this.tryAlternativeUpload(complete, progress, (function () {
                        // Failed, switch back to normal upload.
                        if (this.getSize() > maxUpload) {
                            this.onError(global.pydio.MessageHash[211]);
                            completeCallback();
                            return;
                        }
                        this.xhr = PydioApi.getClient().uploadFile(this._file, 'userfile_0', queryString, complete, error, progress);
                    }).bind(this));
                } else {

                    if (this.getSize() > maxUpload) {
                        this.onError(global.pydio.MessageHash[211]);
                        completeCallback();
                        return;
                    }
                    this.xhr = PydioApi.getClient().uploadFile(this._file, 'userfile_0', queryString, complete, error, progress);
                }
            }
        }, {
            key: '_doAbort',
            value: function _doAbort(completeCallback) {
                if (this.xhr) {
                    try {
                        this.xhr.abort();
                    } catch (e) {}
                }
            }
        }, {
            key: 'tryAlternativeUpload',
            value: function tryAlternativeUpload(completeCallback, progressCallback, errorCallback) {
                var configs = this.getMqConfigs();
                var secure = configs.get("BOOSTER_MAIN_SECURE");
                if (configs.get("BOOSTER_UPLOAD_ADVANCED") && configs.get("BOOSTER_UPLOAD_ADVANCED")['booster_upload_advanced'] === 'custom' && configs.get("BOOSTER_UPLOAD_ADVANCED")['UPLOAD_SECURE']) {
                    secure = configs.get("BOOSTER_UPLOAD_ADVANCED")['UPLOAD_SECURE'];
                }
                var host = configs.get("BOOSTER_MAIN_HOST");
                if (configs.get("BOOSTER_UPLOAD_ADVANCED") && configs.get("BOOSTER_UPLOAD_ADVANCED")['booster_upload_advanced'] === 'custom' && configs.get("BOOSTER_UPLOAD_ADVANCED")['UPLOAD_HOST']) {
                    host = configs.get("BOOSTER_UPLOAD_ADVANCED")['UPLOAD_HOST'];
                }
                var port = configs.get("BOOSTER_MAIN_PORT");
                if (configs.get("BOOSTER_UPLOAD_ADVANCED") && configs.get("BOOSTER_UPLOAD_ADVANCED")['booster_upload_advanced'] === 'custom' && configs.get("BOOSTER_UPLOAD_ADVANCED")['UPLOAD_PORT']) {
                    port = configs.get("BOOSTER_UPLOAD_ADVANCED")['UPLOAD_PORT'];
                }
                var fullPath = this._targetNode.getPath();
                if (this._relativePath) {
                    fullPath += PathUtils.getDirname(this._relativePath);
                }
                fullPath += '/' + encodeURI(PathUtils.getBasename(this._file.name));

                var url = "http" + (secure ? "s" : "") + "://" + host + ":" + port + "/" + configs.get("UPLOAD_PATH") + "/" + this._repositoryId + fullPath;
                var queryString = '';
                var overwriteStatus = UploaderConfigs.getInstance().getOption("DEFAULT_EXISTING", "upload_existing");
                if (overwriteStatus === 'rename') {
                    queryString += 'auto_rename=true';
                }
                try {
                    this.xhr = PydioApi.getClient().uploadFile(this._file, 'userfile_0', queryString, completeCallback, errorCallback, progressCallback, url, { withCredentials: true });
                } catch (e) {
                    errorCallback();
                }
            }
        }]);

        return UploadItem;
    })(StatusItem);

    var FolderItem = (function (_StatusItem2) {
        _inherits(FolderItem, _StatusItem2);

        function FolderItem(path, targetNode) {
            _classCallCheck(this, FolderItem);

            _get(Object.getPrototypeOf(FolderItem.prototype), 'constructor', this).call(this, 'folder');
            this._path = path;
            this._targetNode = targetNode;
        }

        _createClass(FolderItem, [{
            key: 'getPath',
            value: function getPath() {
                return this._path;
            }
        }, {
            key: 'getLabel',
            value: function getLabel() {
                return PathUtils.getBasename(this._path);
            }
        }, {
            key: '_doProcess',
            value: function _doProcess(completeCallback) {
                var fullPath = this._targetNode.getPath() + this._path;
                var params = {
                    get_action: 'mkdir',
                    dir: PathUtils.getDirname(fullPath),
                    dirname: PathUtils.getBasename(fullPath),
                    ignore_exists: true
                };
                if (this._repositoryId && global.pydio.user.activeRepository !== this._repositoryId) {
                    params['tmp_repository_id'] = this._repositoryId;
                }
                PydioApi.getClient().request(params, (function (t) {
                    this.setStatus('loaded');

                    var result = PydioApi.getClient().parseXmlMessage(t.responseXML);
                    if (!result) this.onError('Empty response');

                    completeCallback();
                }).bind(this));
            }
        }, {
            key: '_doAbort',
            value: function _doAbort(completeCallback) {
                if (global.console) global.console.log(global.pydio.MessageHash['html_uploader.6']);
            }
        }]);

        return FolderItem;
    })(StatusItem);

    var UploadTask = (function (_PydioTasks$Task) {
        _inherits(UploadTask, _PydioTasks$Task);

        function UploadTask() {
            _classCallCheck(this, UploadTask);

            _get(Object.getPrototypeOf(UploadTask.prototype), 'constructor', this).call(this, {
                id: 'local-upload-task',
                userId: global.pydio.user.id,
                wsId: global.pydio.user.activeRepository,
                flags: PydioTasks.Task.FLAG_HAS_PROGRESS | PydioTasks.Task.FLAG_STOPPABLE,
                label: global.pydio.MessageHash['html_uploader.7'],
                status: PydioTasks.Task.STATUS_COMPLETE,
                statusMessage: ''
            });
        }

        _createClass(UploadTask, [{
            key: 'setProgress',
            value: function setProgress(progress) {
                this._internal['progress'] = progress;
                this.updateStatus(PydioTasks.Task.STATUS_RUNNING);
            }
        }, {
            key: 'setPending',
            value: function setPending(queueSize) {
                this._internal['statusMessage'] = global.pydio.MessageHash['html_uploader.1'].replace('%s', queueSize);
                this.updateStatus(PydioTasks.Task.STATUS_PENDING);
            }
        }, {
            key: 'setRunning',
            value: function setRunning(queueSize) {
                this._internal['statusMessage'] = global.pydio.MessageHash['html_uploader.2'].replace('%s', queueSize);
                this.updateStatus(PydioTasks.Task.STATUS_RUNNING);
            }
        }, {
            key: 'setIdle',
            value: function setIdle() {
                this._internal['statusMessage'] = '';
                this.updateStatus(PydioTasks.Task.STATUS_COMPLETE);
            }
        }, {
            key: 'updateStatus',
            value: function updateStatus(status) {
                this._internal['status'] = status;
                this.notifyMainStore();
            }
        }, {
            key: 'notifyMainStore',
            value: function notifyMainStore() {
                PydioTasks.Store.getInstance().notify("tasks_updated");
            }
        }, {
            key: 'hasOpenablePane',
            value: function hasOpenablePane() {
                return true;
            }
        }, {
            key: 'openDetailPane',
            value: function openDetailPane() {
                global.pydio.Controller.fireAction("upload");
            }
        }], [{
            key: 'getInstance',
            value: function getInstance() {
                if (!UploadTask.__INSTANCE) {
                    UploadTask.__INSTANCE = new UploadTask();
                    PydioTasks.Store.getInstance().enqueueLocalTask(UploadTask.__INSTANCE);
                }
                return UploadTask.__INSTANCE;
            }
        }]);

        return UploadTask;
    })(PydioTasks.Task);

    var UploaderStore = (function (_Observable2) {
        _inherits(UploaderStore, _Observable2);

        function UploaderStore() {
            _classCallCheck(this, UploaderStore);

            _get(Object.getPrototypeOf(UploaderStore.prototype), 'constructor', this).call(this);
            this._folders = [];
            this._uploads = [];
            this._processing = [];
            this._processed = [];
            this._errors = [];
            // Todo
            this._queueCounter = 0;
            this._maxQueueSize = 2;
        }

        _createClass(UploaderStore, [{
            key: 'recomputeGlobalProgress',
            value: function recomputeGlobalProgress() {
                var totalCount = 0;
                var totalProgress = 0;
                this._uploads.concat(this._processing).concat(this._processed).forEach(function (item) {
                    if (!item.getProgress) return;
                    totalCount += item.getSize();
                    totalProgress += item.getProgress() * item.getSize() / 100;
                });
                var progress = undefined;
                if (!totalCount) {
                    progress = 0;
                } else {
                    progress = totalProgress / totalCount * 100;
                }
                return progress;
            }
        }, {
            key: 'getAutoStart',
            value: function getAutoStart() {
                return UploaderConfigs.getInstance().getOptionAsBool("DEFAULT_AUTO_START", "upload_auto_send");
            }
        }, {
            key: 'getAutoClose',
            value: function getAutoClose() {
                return UploaderConfigs.getInstance().getOptionAsBool("DEFAULT_AUTO_CLOSE", "upload_auto_close");
            }
        }, {
            key: 'pushFolder',
            value: function pushFolder(folderItem) {
                if (!this.getQueueSize()) {
                    this._processed = [];
                }
                this._folders.push(folderItem);
                UploadTask.getInstance().setPending(this.getQueueSize());
                if (this.getAutoStart() && !this._processing.length) {
                    this.processNext();
                } // Autostart with queue was empty before
                this.notify('update');
                this.notify('item_added', folderItem);
            }
        }, {
            key: 'pushFile',
            value: function pushFile(uploadItem) {
                if (!this.getQueueSize()) {
                    this._processed = [];
                }
                this._uploads.push(uploadItem);
                UploadTask.getInstance().setPending(this.getQueueSize());
                uploadItem.observe("progress", (function () {
                    var pg = this.recomputeGlobalProgress();
                    UploadTask.getInstance().setProgress(pg);
                }).bind(this));
                if (this.getAutoStart() && !this._processing.length) {
                    this.processNext();
                } // Autostart with queue was empty before
                this.notify('update');
                this.notify('item_added', uploadItem);
            }
        }, {
            key: 'log',
            value: function log() {}
        }, {
            key: 'processQueue',
            value: function processQueue() {
                var next = this.getNext();
                while (next !== null) {
                    next.process((function () {
                        if (next.getStatus() === 'error') {
                            this._errors.push(next);
                        } else {
                            this._processed.push(next);
                        }
                        this.notify("update");
                    }).bind(this));
                    next = this.getNext();
                }
            }
        }, {
            key: 'getQueueSize',
            value: function getQueueSize() {
                return this._folders.length + this._uploads.length + this._processing.length;
            }
        }, {
            key: 'clearAll',
            value: function clearAll() {
                this._folders = [];
                this._uploads = [];
                this._processing = [];
                this._processed = [];
                this._errors = [];
                this.notify('update');
                UploadTask.getInstance().setIdle();
            }
        }, {
            key: 'processNext',
            value: function processNext() {
                var processable = this.getNext();
                if (processable) {
                    this._processing.push(processable);
                    UploadTask.getInstance().setRunning(this.getQueueSize());
                    processable.process((function () {
                        this._processing = LangUtils.arrayWithout(this._processing, this._processing.indexOf(processable));
                        if (processable.getStatus() === 'error') {
                            this._errors.push(processable);
                        } else {
                            this._processed.push(processable);
                        }
                        this.processNext();
                        this.notify("update");
                    }).bind(this));
                } else {
                    UploadTask.getInstance().setIdle();
                    if (this.hasErrors()) {
                        if (!pydio.getController().react_selector) {
                            global.pydio.getController().fireAction("upload");
                        }
                    } else if (this.getAutoClose()) {
                        this.notify("auto_close");
                    }
                }
            }
        }, {
            key: 'getNext',
            value: function getNext() {
                if (this._folders.length) {
                    return this._folders.shift();
                }
                if (this._uploads.length) {
                    return this._uploads.shift();
                }
            }
        }, {
            key: 'stopOrRemoveItem',
            value: function stopOrRemoveItem(item) {
                item.abort();
                ['_uploads', '_folders', '_processing', '_processed', '_errors'].forEach((function (key) {
                    var arr = this[key];
                    if (arr.indexOf(item) !== -1) {
                        this[key] = LangUtils.arrayWithout(arr, arr.indexOf(item));
                    }
                }).bind(this));
                this.notify("update");
            }
        }, {
            key: 'getItems',
            value: function getItems() {
                return {
                    processing: this._processing,
                    pending: this._folders.concat(this._uploads),
                    processed: this._processed,
                    errors: this._errors
                };
            }
        }, {
            key: 'hasErrors',
            value: function hasErrors() {
                return this._errors.length ? this._errors : false;
            }
        }, {
            key: 'handleFolderPickerResult',
            value: function handleFolderPickerResult(files, targetNode) {
                var folders = {};
                for (var i = 0; i < files.length; i++) {
                    var relPath = null;
                    if (files[i]['webkitRelativePath']) {
                        relPath = '/' + files[i]['webkitRelativePath'];
                        var folderPath = PathUtils.getDirname(relPath);
                        if (!folders[folderPath]) {
                            this.pushFolder(new FolderItem(folderPath, targetNode));
                            folders[folderPath] = true;
                        }
                    }
                    this.pushFile(new UploadItem(files[i], targetNode, relPath));
                }
            }
        }, {
            key: 'handleDropEventResults',
            value: function handleDropEventResults(items, files, targetNode) {
                var _this = this;

                var accumulator = arguments.length <= 3 || arguments[3] === undefined ? null : arguments[3];
                var filterFunction = arguments.length <= 4 || arguments[4] === undefined ? null : arguments[4];

                var oThis = this;

                if (items && items.length && (items[0].getAsEntry || items[0].webkitGetAsEntry)) {
                    var i;
                    var entry;

                    (function () {
                        var error = global.console ? global.console.log : function (err) {
                            global.alert(err);
                        };
                        var length = items.length;
                        for (i = 0; i < length; i++) {
                            if (items[i].kind && items[i].kind != 'file') continue;
                            if (items[0].getAsEntry) {
                                entry = items[i].getAsEntry();
                            } else {
                                entry = items[i].webkitGetAsEntry();
                            }
                            if (entry.isFile) {
                                entry.file(function (File) {
                                    if (File.size == 0) return;
                                    var uploadItem = new UploadItem(File, targetNode);
                                    if (filterFunction && !filterFunction(uploadItem)) return;
                                    if (!accumulator) oThis.pushFile(uploadItem);else accumulator.push(uploadItem);
                                }, error);
                            } else if (entry.isDirectory) {
                                var folderItem = new FolderItem(entry.fullPath, targetNode);
                                if (filterFunction && !filterFunction(folderItem)) continue;
                                if (!accumulator) oThis.pushFolder(folderItem);else accumulator.push(folderItem);

                                _this.recurseDirectory(entry, function (fileEntry) {
                                    var relativePath = fileEntry.fullPath;
                                    fileEntry.file(function (File) {
                                        if (File.size == 0) return;
                                        var uploadItem = new UploadItem(File, targetNode, relativePath);
                                        if (filterFunction && !filterFunction(uploadItem)) return;
                                        if (!accumulator) oThis.pushFile(uploadItem);else accumulator.push(uploadItem);
                                    }, error);
                                }, function (folderEntry) {
                                    var folderItem = new FolderItem(folderEntry.fullPath, targetNode);
                                    if (filterFunction && !filterFunction(uploadItem)) return;
                                    if (!accumulator) oThis.pushFolder(folderItem);else accumulator.push(folderItem);
                                }, error);
                            }
                        }
                    })();
                } else {
                    for (var j = 0; j < files.length; j++) {
                        if (files[j].size === 0) {
                            alert(global.pydio.MessageHash['html_uploader.8']);
                            return;
                        }
                        var _uploadItem = new UploadItem(files[j], targetNode);
                        if (filterFunction && !filterFunction(_uploadItem)) continue;
                        if (!accumulator) oThis.pushFile(_uploadItem);else accumulator.push(_uploadItem);
                    }
                }
                UploaderStore.getInstance().log();
            }
        }, {
            key: 'recurseDirectory',
            value: function recurseDirectory(item, fileHandler, folderHandler, errorHandler) {

                var recurseDir = this.recurseDirectory.bind(this);
                var dirReader = item.createReader();
                var entries = [];

                var toArray = function toArray(list) {
                    return Array.prototype.slice.call(list || [], 0);
                };

                // Call the reader.readEntries() until no more results are returned.
                var readEntries = function readEntries() {
                    dirReader.readEntries(function (results) {
                        if (!results.length) {

                            entries.map(function (e) {
                                if (e.isDirectory) {
                                    folderHandler(e);
                                    recurseDir(e, fileHandler, folderHandler, errorHandler);
                                } else {
                                    fileHandler(e);
                                }
                            });
                        } else {
                            entries = entries.concat(toArray(results));
                            readEntries();
                        }
                    }, errorHandler);
                };

                readEntries(); // Start reading dirs.
            }
        }], [{
            key: 'getInstance',
            value: function getInstance() {
                if (!UploaderStore.__INSTANCE) {
                    UploaderStore.__INSTANCE = new UploaderStore();
                }
                return UploaderStore.__INSTANCE;
            }
        }]);

        return UploaderStore;
    })(Observable);

    var UploaderConfigs = (function (_Observable3) {
        _inherits(UploaderConfigs, _Observable3);

        _createClass(UploaderConfigs, null, [{
            key: 'getInstance',
            value: function getInstance() {
                if (!UploaderConfigs.__INSTANCE) UploaderConfigs.__INSTANCE = new UploaderConfigs();
                return UploaderConfigs.__INSTANCE;
            }
        }]);

        function UploaderConfigs() {
            _classCallCheck(this, UploaderConfigs);

            _get(Object.getPrototypeOf(UploaderConfigs.prototype), 'constructor', this).call(this);
            pydio.observe("registry_loaded", (function () {
                this._global = null;
                this._mq = null;
            }).bind(this));
        }

        _createClass(UploaderConfigs, [{
            key: '_loadOptions',
            value: function _loadOptions() {
                if (!this._global) {
                    this._global = global.pydio.getPluginConfigs("uploader");
                    this._mq = global.pydio.getPluginConfigs("mq");
                }
            }
        }, {
            key: 'extensionAllowed',
            value: function extensionAllowed(uploadItem) {
                var extString = this.getOption("ALLOWED_EXTENSIONS", '', '');
                if (!extString) return true;
                var extDescription = this.getOption("ALLOWED_EXTENSIONS_READABLE", '', '');
                if (extDescription) extDescription = ' (' + extDescription + ')';
                var itemExt = PathUtils.getFileExtension(uploadItem.getLabel());
                if (extString.split(',').indexOf(itemExt) === -1) {
                    throw new Error(global.pydio.MessageHash[367] + extString + extDescription);
                }
            }
        }, {
            key: 'getOptionAsBool',
            value: function getOptionAsBool(name) {
                var userPref = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
                var defaultValue = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

                var o = this.getOption(name, userPref, defaultValue);
                return o === true || o === 'true';
            }
        }, {
            key: 'getOption',
            value: function getOption(name) {
                var userPref = arguments.length <= 1 || arguments[1] === undefined ? '' : arguments[1];
                var defaultValue = arguments.length <= 2 || arguments[2] === undefined ? undefined : arguments[2];

                this._loadOptions();
                if (userPref) {
                    var test = this.getUserPreference('originalUploadForm_XHRUploader', userPref);
                    if (test !== undefined && test !== null) return test;
                }
                if (this._global.has(name)) {
                    return this._global.get(name);
                }
                if (this._mq.has(name)) {
                    return this._mq.get(name);
                }
                if (defaultValue !== undefined) {
                    return defaultValue;
                }
                return null;
            }
        }, {
            key: 'updateOption',
            value: function updateOption(name, value) {
                var isBool = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

                if (isBool) {
                    value = value ? "true" : "false";
                }
                this.setUserPreference('originalUploadForm_XHRUploader', name, value);
                this.notify("change");
            }

            // TODO: SHOULD BE IN A "CORE" COMPONENT
        }, {
            key: 'getUserPreference',
            value: function getUserPreference(guiElementId, prefName) {
                var pydio = global.pydio;
                if (!pydio.user) return null;
                var gui_pref = pydio.user.getPreference("gui_preferences", true);
                if (!gui_pref || !gui_pref[guiElementId]) return null;
                if (pydio.user.activeRepository && gui_pref[guiElementId]['repo-' + pydio.user.activeRepository]) {
                    return gui_pref[guiElementId]['repo-' + pydio.user.activeRepository][prefName];
                }
                return gui_pref[guiElementId][prefName];
            }
        }, {
            key: 'setUserPreference',
            value: function setUserPreference(guiElementId, prefName, prefValue) {
                var pydio = global.pydio;
                if (!pydio || !pydio.user) return;
                var guiPref = pydio.user.getPreference("gui_preferences", true);
                if (!guiPref) guiPref = {};
                if (!guiPref[guiElementId]) guiPref[guiElementId] = {};
                if (pydio.user.activeRepository) {
                    var repokey = 'repo-' + pydio.user.activeRepository;
                    if (!guiPref[guiElementId][repokey]) guiPref[guiElementId][repokey] = {};
                    if (guiPref[guiElementId][repokey][prefName] && guiPref[guiElementId][repokey][prefName] == prefValue) {
                        return;
                    }
                    guiPref[guiElementId][repokey][prefName] = prefValue;
                } else {
                    if (guiPref[guiElementId][prefName] && guiPref[guiElementId][prefName] == prefValue) {
                        return;
                    }
                    guiPref[guiElementId][prefName] = prefValue;
                }
                pydio.user.setPreference("gui_preferences", guiPref, true);
                pydio.user.savePreference("gui_preferences");
            }
        }]);

        return UploaderConfigs;
    })(Observable);

    var ns = global.UploaderModel || {};
    ns.Store = UploaderStore;
    ns.Configs = UploaderConfigs;
    ns.UploadItem = UploadItem;
    ns.FolderItem = FolderItem;
    global.UploaderModel = ns;
})(window);
