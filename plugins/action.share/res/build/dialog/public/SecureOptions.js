'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _ShareContextConsumer = require('../ShareContextConsumer');

var _ShareContextConsumer2 = _interopRequireDefault(_ShareContextConsumer);

var _mainCard = require('../main/Card');

var _mainCard2 = _interopRequireDefault(_mainCard);

var React = require('react');

var _require = require('material-ui');

var FlatButton = _require.FlatButton;
var TextField = _require.TextField;
var DatePicker = _require.DatePicker;

var _require$requireLib = require('pydio').requireLib('form');

var ValidPassword = _require$requireLib.ValidPassword;

var ShareModel = require('pydio').requireLib('ReactModelShare');

var PublicLinkSecureOptions = React.createClass({
    displayName: 'PublicLinkSecureOptions',

    propTypes: {
        linkData: React.PropTypes.object.isRequired,
        shareModel: React.PropTypes.instanceOf(ShareModel),
        style: React.PropTypes.object
    },

    updateDLExpirationField: function updateDLExpirationField(event) {
        var newValue = event.currentTarget.value;
        if (parseInt(newValue) < 0) newValue = -parseInt(newValue);
        this.props.shareModel.setExpirationFor(this.props.linkData.hash, "downloads", newValue);
    },

    updateDaysExpirationField: function updateDaysExpirationField(event, newValue) {
        if (!newValue) {
            newValue = event.currentTarget.getValue();
        }
        this.props.shareModel.setExpirationFor(this.props.linkData.hash, "days", newValue);
    },

    onDateChange: function onDateChange(event, value) {
        var today = new Date();
        var date1 = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());
        var date2 = Date.UTC(value.getFullYear(), value.getMonth(), value.getDate());
        var ms = Math.abs(date1 - date2);
        var integerVal = Math.floor(ms / 1000 / 60 / 60 / 24); //floor should be unnecessary, but just in case
        this.updateDaysExpirationField(event, integerVal);
    },

    resetPassword: function resetPassword() {
        this.props.shareModel.resetPassword(this.props.linkData.hash);
    },

    updatePassword: function updatePassword(newValue, oldValue) {
        this.props.shareModel.updatePassword(this.props.linkData.hash, newValue);
    },

    renderPasswordContainer: function renderPasswordContainer() {
        var linkId = this.props.linkData.hash;
        var passwordField;
        if (this.props.shareModel.hasHiddenPassword(linkId)) {
            var resetPassword = React.createElement(FlatButton, {
                disabled: this.props.isReadonly(),
                secondary: true,
                onClick: this.resetPassword,
                label: this.props.getMessage('174')
            });
            passwordField = React.createElement(TextField, {
                floatingLabelText: this.props.getMessage('23'),
                disabled: true,
                value: '********',
                onChange: this.updatePassword,
                fullWidth: true
            });
        } else if (!this.props.isReadonly()) {
            passwordField = React.createElement(ValidPassword, {
                name: 'share-password',
                attributes: { label: this.props.getMessage('23') },
                value: this.props.shareModel.getPassword(linkId),
                onChange: this.updatePassword
            });
        }
        if (passwordField) {
            return React.createElement(
                'div',
                { className: 'password-container', style: { display: 'flex', alignItems: 'baseline', marginBottom: 10 } },
                React.createElement('span', { className: 'ajxp_icon_span mdi mdi-file-lock' }),
                React.createElement(
                    'div',
                    { style: { width: resetPassword ? '50%' : '100%', display: 'inline-block' } },
                    passwordField
                ),
                resetPassword && React.createElement(
                    'div',
                    { style: { width: '50%', display: 'inline-block' } },
                    resetPassword
                )
            );
        } else {
            return null;
        }
    },

    formatDate: function formatDate(dateObject) {
        var dateFormatDay = this.props.getMessage('date_format', '').split(' ').shift();
        return dateFormatDay.replace('Y', dateObject.getFullYear()).replace('m', dateObject.getMonth() + 1).replace('d', dateObject.getDate());
    },

    render: function render() {
        var linkId = this.props.linkData.hash;
        var passContainer = this.renderPasswordContainer();
        var crtLinkDLAllowed = this.props.shareModel.getPublicLinkPermission(linkId, 'download');
        var dlLimitValue = this.props.shareModel.getExpirationFor(linkId, 'downloads') === 0 ? "" : this.props.shareModel.getExpirationFor(linkId, 'downloads');
        var expirationDateValue = this.props.shareModel.getExpirationFor(linkId, 'days') === 0 ? "" : this.props.shareModel.getExpirationFor(linkId, 'days');
        var auth = ShareModel.getAuthorizations(this.props.pydio);
        var today = new Date();

        var calIcon = React.createElement('span', { className: 'ajxp_icon_span mdi mdi-calendar-clock' });
        var expDate = undefined,
            maxDate = undefined,
            maxDownloads = null,
            dateExpired = false,
            dlExpired = false;
        if (parseInt(auth.max_expiration) > 0) {
            maxDate = new Date();
            maxDate.setDate(today.getDate() + parseInt(auth.max_expiration));
        }
        if (parseInt(auth.max_downloads) > 0) {
            maxDownloads = parseInt(auth.max_downloads);
            dlLimitValue = Math.min(dlLimitValue, maxDownloads);
        }
        if (expirationDateValue) {
            if (expirationDateValue < 0) {
                dateExpired = true;
            }
            expDate = new Date();
            expDate.setDate(today.getDate() + parseInt(expirationDateValue));
            var clearValue = (function () {
                this.props.shareModel.setExpirationFor(linkId, "days", "");
            }).bind(this);
            calIcon = React.createElement('span', { className: 'mdi mdi-close-circle ajxp_icon_span', onClick: clearValue });
            var calLabel = React.createElement(
                'span',
                { className: 'calLabelHasValue' },
                this.props.getMessage(dateExpired ? '21b' : '21')
            );
        }
        if (dlLimitValue) {
            var dlCounter = this.props.shareModel.getDownloadCounter(linkId);
            var resetDl = (function () {
                if (window.confirm(this.props.getMessage('106'))) {
                    this.props.shareModel.resetDownloadCounter(linkId, function () {});
                }
            }).bind(this);
            if (dlCounter) {
                var resetLink = React.createElement(
                    'a',
                    { style: { cursor: 'pointer' }, onClick: resetDl, title: this.props.getMessage('17') },
                    '(',
                    this.props.getMessage('16'),
                    ')'
                );
                if (dlCounter >= dlLimitValue) {
                    dlExpired = true;
                }
            }
            var dlCounterString = React.createElement(
                'span',
                { className: 'dlCounterString' },
                dlCounter + '/' + dlLimitValue,
                ' ',
                resetLink
            );
        }
        return React.createElement(
            _mainCard2['default'],
            { style: this.props.style, title: this.props.getMessage('196') },
            React.createElement(
                'div',
                { className: 'section-legend' },
                this.props.getMessage('24')
            ),
            passContainer,
            React.createElement(
                'div',
                { className: 'expires', style: { display: 'flex', alignItems: 'center' } },
                React.createElement(
                    'div',
                    { style: { flex: 1, display: 'flex', alignItems: 'center', position: 'relative' }, className: dateExpired ? 'limit-block-expired' : null },
                    calIcon,
                    React.createElement(DatePicker, {
                        ref: 'expirationDate',
                        key: 'start',
                        value: expDate,
                        minDate: new Date(),
                        maxDate: maxDate,
                        autoOk: true,
                        disabled: this.props.isReadonly(),
                        onChange: this.onDateChange,
                        showYearSelector: true,
                        floatingLabelText: this.props.getMessage(dateExpired ? '21b' : '21'),
                        mode: 'landscape',
                        formatDate: this.formatDate,
                        style: { flex: 1 },
                        fullWidth: true
                    })
                ),
                React.createElement(
                    'div',
                    { style: { flex: 1, alignItems: 'center', display: crtLinkDLAllowed ? 'flex' : 'none', position: 'relative' }, className: dlExpired ? 'limit-block-expired' : null },
                    React.createElement('span', { className: 'mdi mdi-download ajxp_icon_span' }),
                    React.createElement(TextField, {
                        type: 'number',
                        disabled: this.props.isReadonly(),
                        floatingLabelText: this.props.getMessage(dlExpired ? '22b' : '22'),
                        value: dlLimitValue > 0 ? dlLimitValue : '',
                        onChange: this.updateDLExpirationField,
                        fullWidth: true,
                        style: { flex: 1 }
                    }),
                    dlCounterString
                )
            )
        );
    }
});

exports['default'] = PublicLinkSecureOptions = (0, _ShareContextConsumer2['default'])(PublicLinkSecureOptions);
exports['default'] = PublicLinkSecureOptions;
module.exports = exports['default'];
