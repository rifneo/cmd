/*
 * Copyright 2007-2017 Charles du Jeu - Abstrium SAS <team (at) pyd.io>
 * This file is part of Pydio.
 *
 * Pydio is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Pydio is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with Pydio.  If not, see <http://www.gnu.org/licenses/>.
 *
 * The latest code can be found at <https://pydio.com>.
 */

'use strict';

Object.defineProperty(exports, '__esModule', {
    value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _VideoPlayer = require('./VideoPlayer');

var _VideoPlayer2 = _interopRequireDefault(_VideoPlayer);

var _boardPalette = require('../board/Palette');

var _boardPalette2 = _interopRequireDefault(_boardPalette);

var _boardColorPaper = require('../board/ColorPaper');

var _boardColorPaper2 = _interopRequireDefault(_boardColorPaper);

var React = require('react');
var ReactDOM = require('react-dom');

var _require$requireLib = require('pydio').requireLib('components');

var asGridItem = _require$requireLib.asGridItem;

var _require = require('material-ui');

var MenuItem = _require.MenuItem;
var IconMenu = _require.IconMenu;

var PALETTE_INDEX = 4;

/**
 * Display a list of tutorial videos as a material card
 */
var VideoCard = React.createClass({
    displayName: 'VideoCard',

    propTypes: {
        youtubeId: React.PropTypes.string,
        contentMessageId: React.PropTypes.string
    },

    getInitialState: function getInitialState() {
        this._videos = [['qvsSeLXr-T4', 'user_home.63'], ['HViCWPpyZ6k', 'user_home.79'], ['jBRNqwannJM', 'user_home.80'], ['2jl1EsML5v8', 'user_home.81'], ['28-t4dvhE6c', 'user_home.82'], ['fP0MVejnVZE', 'user_home.83'], ['TXFz4w4trlQ', 'user_home.84'], ['OjHtgnL_L7Y', 'user_home.85'], ['ot2Nq-RAnYE', 'user_home.66']];
        var k = Math.floor(Math.random() * this._videos.length);
        var value = this._videos[k];
        return {
            videoIndex: k,
            youtubeId: value[0],
            contentMessageId: value[1]
        };
    },

    launchVideo: function launchVideo() {
        var url = "//www.youtube.com/embed/" + this.state.youtubeId + "?list=PLxzQJCqzktEbYm3U_O1EqFru0LsEFBca5&autoplay=1";
        this._videoDiv = document.createElement('div');
        document.body.appendChild(this._videoDiv);
        ReactDOM.render(React.createElement(_VideoPlayer2['default'], { videoSrc: url, closePlayer: this.closePlayer }), this._videoDiv);
    },

    closePlayer: function closePlayer() {
        ReactDOM.unmountComponentAtNode(this._videoDiv);
        document.body.removeChild(this._videoDiv);
    },

    getTitle: function getTitle(messId) {
        var text = this.props.pydio.MessageHash[messId];
        return text.split('\n').shift().replace('<h2>', '').replace('</h2>', '');
    },

    browse: function browse(direction, event) {
        if (direction === undefined) direction = 'next';

        var nextIndex = undefined;
        var videoIndex = this.state.videoIndex;

        if (direction === 'next') {
            nextIndex = videoIndex < this._videos.length - 1 ? videoIndex + 1 : 0;
        } else {
            nextIndex = videoIndex > 0 ? videoIndex - 1 : this._videos.length - 1;
        }
        var value = this._videos[nextIndex];
        this.setState({
            videoIndex: nextIndex,
            youtubeId: value[0],
            contentMessageId: value[1]
        });
    },

    render: function render() {
        var _this2 = this;

        var MessageHash = this.props.pydio.MessageHash;
        var htmlMessage = function htmlMessage(id) {
            return { __html: MessageHash[id] };
        };
        var menus = this._videos.map((function (item, index) {
            var _this = this;

            return React.createElement(MenuItem, { key: 'videoCardMenuItem_' + index, primaryText: this.getTitle(item[1]), onTouchTap: function () {
                    _this.setState({ youtubeId: item[0], contentMessageId: item[1], videoIndex: index });
                } });
        }).bind(this));
        var props = _extends({}, this.props);
        var _state = this.state;
        var youtubeId = _state.youtubeId;
        var contentMessageId = _state.contentMessageId;

        props.className += ' video-card';

        var tint = MaterialUI.Color(_boardPalette2['default'][PALETTE_INDEX]).alpha(0.8).toString();
        return React.createElement(
            _boardColorPaper2['default'],
            _extends({}, props, { paletteIndex: PALETTE_INDEX, getCloseButton: function () {
                    return _this2.props.closeButton;
                } }),
            React.createElement(
                'div',
                { className: 'tutorial_legend' },
                React.createElement(
                    'div',
                    { className: 'tutorial_video_thumb', style: { backgroundImage: 'url("https://img.youtube.com/vi/' + youtubeId + '/0.jpg")' } },
                    React.createElement('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: tint } }),
                    React.createElement('div', { className: 'tutorial_prev mdi mdi-arrow-left', onClick: this.browse.bind(this, 'previous') }),
                    React.createElement('div', { className: 'tutorial_play mdi mdi-play', onClick: this.launchVideo }),
                    React.createElement('div', { className: 'tutorial_next mdi mdi-arrow-right', onClick: this.browse.bind(this, 'next') }),
                    React.createElement(
                        'div',
                        { className: 'tutorial_title' },
                        React.createElement('span', { dangerouslySetInnerHTML: htmlMessage(contentMessageId) }),
                        React.createElement(
                            IconMenu,
                            {
                                style: { position: 'absolute', bottom: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.43)', padding: 2, borderRadius: '0 0 2px 0' },
                                iconStyle: { color: 'white' },
                                iconButtonElement: React.createElement(MaterialUI.IconButton, { iconClassName: 'mdi mdi-dots-vertical' }),
                                anchorOrigin: { horizontal: 'right', vertical: 'top' },
                                targetOrigin: { horizontal: 'right', vertical: 'top' }
                            },
                            menus
                        )
                    )
                )
            )
        );
    }
});

exports['default'] = VideoCard = asGridItem(VideoCard, global.pydio.MessageHash['user_home.94'], { gridWidth: 2, gridHeight: 12 }, []);
exports['default'] = VideoCard;
module.exports = exports['default'];
