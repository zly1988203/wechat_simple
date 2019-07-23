/**
 * 微信菜单管理
 * date: 2016-07-26
 * author: summer <summer@68coder.com>
 * version: 1.0.0
 */

/*
window.onbeforeunload = function(event) { 
	return "微信菜单修改还未保存。"; 
} 
*/
;(function($) {
	
	//返回字节数，字母占一个字节，汉字占两个字节
	String.prototype.getLength = function() {
		var text = this.replace(/[^\x00-\xff]/g,"**");
		return text.length;
	}
	
	//截取中英文混合字节，一个汉字占两个字节, len:要截取的长度， alt:末尾补充的字符，如：...
	String.prototype.getShortForm = function(len, alt) {
		var tempStr = this;
		if(this.getLength() > len) {
			if(!alt) alt = '';
			var i = 0;
			for(var z = 0;z < len; z++) {
				if(tempStr.charCodeAt(z) > 255){
					i = i+2;
				} else {
					i=i+1;
				}
				if(i >= len) {
					tempStr=tempStr.slice(0,(z + 1)) + alt;
					break;
				}
			}
			return tempStr;
		} else {
			return this + '';
		}
	}
	
	// 当前正在操作的菜单
	var _wechatMenuData = [];
	var _parentTips = '字数不超过4个汉字或8个字母';
	var _childTips = '字数不超过8个汉字或16个字母';
	
	// 显示表单
	var showWechatMenuForm = function(object, isParent) {
		$('#menuNone').hide();
		$('#menuRightBox').show();
		
		//回选数据
		$('#menuName').val(object.name);
		$('#menuType' + object.type).iCheck('check');
		if(object.type == 1) {
			$('#menuUrl').val('');
			$('#menuContent').val(object.content);
			$('#menuTab1').show();
			$('#menuTab2').hide();
		}else if(object.type == 2) {
			$('#menuContent').val('');
			$('#menuUrl').val(object.content);
			$('#menuTab1').hide();
			$('#menuTab2').show();
		}
		
		if(isParent) {
			$('.menu-form .frm-tips').text(_parentTips);
			if(object.sub.length > 0) {
				$('.menu-sub-form').hide();
			} else {
				$('.menu-sub-form').show();
			}
		} else {
			$('.menu-form .frm-tips').text(_childTips);
			$('.menu-sub-form').show();
		}
	}
	
	// 更新数据
	var updateData = function() {
		var current = $('.mobile-bd .current');
		if(current.length <= 0) return;
		var currIndex = current.index();
		var data = _wechatMenuData;
		
		var menuName  = $.trim($('#menuName').val());
		var menuType = $('input[type="radio"][name="menuType"]:checked').val();
		var menuContent = menuType == 1 ? $.trim($('#menuContent').val()) : $.trim($('#menuUrl').val());
		
		if(menuName.length <= 0) {
			$('#menuName').next('.frm-tips').addClass('text-error').text('菜单名称不能为空。');
		}
		if(!current.hasClass('parent-menu-item')) {
			//更新子菜单
			if(menuName.length <= 0) {
				menuName = '子菜单名称';
			} else {
				$('#menuName').next('.frm-tips').text(_childTips).removeClass('text-error');
			}
			menuName = menuName.getShortForm(16);
			var preIndex = current.parent().closest('li').index();
			data[preIndex]['sub'][currIndex]['name'] = menuName;
			data[preIndex]['sub'][currIndex]['type'] = menuType;
			data[preIndex]['sub'][currIndex]['content'] = menuContent;
		} else {
			//更新父菜单
			if(menuName.length <= 0) {
				menuName = '菜单名称';
			} else {
				$('#menuName').next('.frm-tips').text(_parentTips).removeClass('text-error');
			}
			menuName = menuName.getShortForm(8);
			data[currIndex]['name'] = menuName;
			if(data[currIndex]['sub'].length <= 0) {
				data[currIndex]['type'] = menuType;
				data[currIndex]['content'] = menuContent;
			}
		}
		
		current.children('a').text(menuName);
	}
	
	//绑定菜单的点击事件
	var bindClickEvent = function() {
		
		//绑定父菜单数据点击事件
		$('.parent-menu-data .parent-menu-link').off('click').on('click', function() {
			updateData();
			$('#menuName').next('.frm-tips').removeClass('text-error');
			$('.mobile-bd .current').removeClass('current');
			$(this).parent().addClass('current');
			$('.sub-menu-box:visible').hide();
			$(this).parent().children('.sub-menu-box').show();
			var index = $(this).parent().index();
			showWechatMenuForm(_wechatMenuData[index], true);
		});
		
		//绑定点击子菜单事件
		$('.child-menu-data').off('click').on('click', function() {
			updateData();
			$('#menuName').next('.frm-tips').removeClass('text-error');
			$('.mobile-bd .current').removeClass('current');
			$(this).addClass('current');
			var currIndex = $(this).index();
			var prevIndex = $(this).parent().closest('li').index();
			showWechatMenuForm(_wechatMenuData[prevIndex]['sub'][currIndex], false);

		});
	}
	
	//添加子菜单
	var addChildEvent = function() {
		$('.add-child-menu').off('click').on('click', function() {
			updateData();
			var data = {name: '子菜单名称', type: 1, content: ''};
			var prevIndex = $(this).parent().closest('li').index();
			_wechatMenuData[prevIndex]['sub'].push(data);
			_wechatMenuData[prevIndex]['type'] = 1;
			_wechatMenuData[prevIndex]['content'] = '';
			$('.mobile-bd .current').removeClass('current');
			var strHtml = '<li class="child-menu-data current"><a href="javascript:void(0)">' + data.name + '</a></li>';
			$(this).before(strHtml);
			
			//最多只能添加5个子菜单
			if(_wechatMenuData[prevIndex]['sub'].length >= 5) {
				$(this).hide();
			}
			
			bindClickEvent();
			
			showWechatMenuForm(data, false);
		});
	}
	
	//添加父菜单事件
	var addParentEvent = function() {
		$('.add-parent-menu').off('click').on('click', function() {
			if(_wechatMenuData.length <= 0) {
				$(this).html('<a class="parent-menu-link" href="javascript:void(0)"><i class="icon"></i></a>').removeClass('current');
			} else {
				updateData();
			}
			var data = {name: '菜单名称', type: 1, content: '', sub:[]};
			var oldSize = _wechatMenuData.length;
			_wechatMenuData.push(data);
			$('.parent-menu-item').removeClass('zone' + oldSize).addClass('zone' + _wechatMenuData.length);
			$('.mobile-bd .current').removeClass('current');
			$('.sub-menu-box').hide();
			if(_wechatMenuData.length >= 3) {
				 $(this).hide();
			}
			var strHtml = '<li class="parent-menu-data parent-menu-item current zone' + _wechatMenuData.length + (_wechatMenuData.length >= 3 ? ' no_extra' : '') + '">' +
					'<a class="parent-menu-link" href="javascript:void(0)">' + data.name + '</a>' +
					'<div class="sub-menu-box">' +
						'<ul><li class="add-child-menu"><a href="javascript:void(0)"><i class="icon"></i></a></li></ul>' +
						'<i class="arrow arrow-out"></i>' +
						'<i class="arrow arrow-in"></i>' + 
					'</div>' +
			  '</li>';
			$(this).before(strHtml);
			
			bindClickEvent();
			
			addChildEvent();
			showWechatMenuForm(data, true);
		});
	}
	
	// 表单默认事件
	var formDefaultEvent = function() {
		// 类型选择
		$('input[type="radio"][name="menuType"]').on('ifChecked', function(e) {
			if($(this).val() == 1) {
				$('#menuTab1').show();
				$('#menuTab2').hide();
			} else if($(this).val() == 2) {
				$('#menuTab1').hide();
				$('#menuTab2').show();
			}
		});
		
		$('#menuName').keyup(function() {
			updateData();
		});
		
		//删除
		$('.menu-form .delete-btn').off('click').on('click', function() {
			$.sui.confirm('是否确定要移除此微信菜单项？', function() {
				var currElement = $('.mobile-bd .current');
				if(currElement.length <= 0) return;
				var currIndex = currElement.index();
				
				if(currElement.hasClass('parent-menu-data')) {
					// 删除父菜单
					_wechatMenuData.splice(currIndex, 1);
					currElement.remove();
					$('.mobile-bd').children('li').removeClass('zone' + (_wechatMenuData.length + 1)).addClass('zone' + _wechatMenuData.length);
					if(_wechatMenuData.length > 0) {
						$('.mobile-bd').children('li').eq(_wechatMenuData.length - 1).removeClass('no_extra');
						$('.add-parent-menu').show().children('a').html('<i class="icon"></i>');
					} else {
						$('.add-parent-menu').show().addClass('current').children('a').html('<i class="icon"></i> 添加菜单');
					}
				} else {
					// 删除子菜单
					var preIndex = currElement.parent().closest('li').index();
					_wechatMenuData[preIndex]['sub'].splice(currIndex, 1);
					currElement.remove();
					$('.add-child-menu').show();
				}
				
				$('#menuNone').show();
				$('#menuRightBox').hide();
			});
		});
	}
	
	window.wechatMenu = {
		defaults: [],
		update: updateData,
		get: function() {
			updateData();
			//获取数据
			var data = [];
			$.each(_wechatMenuData, function(k, v) {
				var object = {name:v.name, type:v.type, content: v.content};
				var sub = [];
				$.each(v.sub, function(kk, vv) {
					if(kk < 5) {
						sub.push({name:vv.name, type:vv.type, content: vv.content});
					}
				})
				object.sub = sub;
				if(k < 3) {
					data.push(object);
				}
			});
			return data;
		},
		reset: function() {
			//还原默认
			$('.mobile-bd').html('');
			$('#menuNone').show();
			$('#menuRightBox').hide();
			this.initialize(null);
		},
		initialize: function(data) {
			
			//初始化
			if(data) {
				_wechatMenuData = data;
			} else if(this.defaults) {
				//使用深拷贝获取默认值
				_wechatMenuData = [];
				$.each(this.defaults, function(k, v) {
					var object = {name:v.name, type:v.type, content: v.content};
					var sub = [];
					$.each(v.sub, function(kk, vv) {
						if(kk < 5) {
							sub.push({name:vv.name, type:vv.type, content: vv.content});
						}
					})
					object.sub = sub;
					if(k < 3) {
						_wechatMenuData.push(object);
					}
				});
			}
		
			$('#menuNone').text('请点击左侧菜单进行编辑操作~!');
			var strHtml = '';
			// 输出主菜单
			$.each(_wechatMenuData, function(k, parent) {
				if(parent.type == 3){ //小程序做隐藏处理
					strHtml += '<li class="parent-menu-hide parent-menu-data parent-menu-item zone' + _wechatMenuData.length + (k >= 2 ? ' no_extra' : '') + '"><a class="parent-menu-link" href="javascript:void(0)">' + parent.name + '</a><div class="sub-menu-box" style="display:none"><ul>';
				}else{
					strHtml += '<li class="parent-menu-data parent-menu-item zone' + _wechatMenuData.length + (k >= 2 ? ' no_extra' : '') + '"><a class="parent-menu-link" href="javascript:void(0)">' + parent.name + '</a><div class="sub-menu-box" style="display:none"><ul>';
				}
				// 输出子菜单
				$.each(parent.sub, function(kk, child) {
					strHtml += '<li class="child-menu-data"><a href="javascript:void(0)">' + child.name + '</a></li>';
				});
				
				if(parent.sub.length < 5) {
					strHtml += '<li class="add-child-menu"><a href="javascript:void(0)"><i class="icon"></i></a></li>';
				}
				
				strHtml += '</ul>' +
						'<i class="arrow arrow-out"></i>' +
						'<i class="arrow arrow-in"></i>' + 
						'</div>' +
					'</li>';
			});
			
			//补充主菜单的添加按钮
			if(_wechatMenuData.length == 0) {
				strHtml += '<li class="parent-menu-item add-parent-menu current zone' + _wechatMenuData.length + '">' +
								'<a class="parent-menu-link" href="javascript:void(0)"><i class="icon"></i> 添加菜单</a>' +
							'</li>';
			} else {
				strHtml += '<li class="parent-menu-item add-parent-menu zone' + _wechatMenuData.length + '"' + (_wechatMenuData.length >= 3 ? 'style="display:none"' : '') + '>' +
								'<a class="parent-menu-link" href="javascript:void(0)"><i class="icon"></i></a>' +
							'</li>';
			}
			
			$('.mobile-bd').html(strHtml);
			
			if(_wechatMenuData.length > 0) {
				var data = _wechatMenuData[0];
				showWechatMenuForm(data, true);
				$('.parent-menu-data').eq(0).addClass('current').children('.sub-menu-box').show();
				bindClickEvent();
				addChildEvent();
			}
			
			addParentEvent();
			formDefaultEvent();
		}
	}
})(jQuery);