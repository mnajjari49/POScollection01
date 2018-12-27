odoo.define('skit_hotel_management.vendor_dashboard', function (require) {
"use strict";
var PosBaseWidget = require('point_of_sale.BaseWidget');
var chrome = require('point_of_sale.chrome');
var gui = require('point_of_sale.gui');
var models = require('point_of_sale.models');
var screens = require('point_of_sale.screens');
var core = require('web.core');
var rpc = require('web.rpc');

var QWeb = core.qweb;
var _t = core._t;


/*var VendorCategoryWidget = PosBaseWidget.extend({
    template:'VendorCategoryWidget',
    init: function(parent, options) {
        var self = this;
        this._super(parent,options);
        this.model = options.model;
    },
});*/

var VendorDashboardScreenWidget = screens.ScreenWidget.extend({
    template: 'VendorDashboardScreenWidget',
    init: function(parent, options){
        this._super(parent, options);
       
    },
    hide: function(){
        this._super();
       
        this.chrome.widget.order_selector.show();
    },
    show: function(){
        this._super();
        this.chrome.widget.order_selector.hide();
        var dashboards = this.pos.vendor_dashboard;
        var dashboard_lines = this.pos.vendor_dashboard_line;
        //var parent_devotee = this.pos.db.get_dashboardline_by_dashboard(1);
        var self = this;
        var el_node = this;
        //console.log('DASH'+ JSON.stringify(dashboards));
        //console.log('DASHLine'+ JSON.stringify(dashboard_lines));
        //console.log('dfs'+ JSON.stringify(parent_devotee));
        //console.log('Len'+dashboards.length)
        this.render_list(dashboards);
        /*$('.info').first().show().animate({
            width: '40%'
          });
        $('.item').first().css({'display': 'none'});*/
        var width = 100 - (dashboards.length * 4);
        this.$('.item').click(function(){
        	$(this).css({'display': 'none'});
        	//$(".test").css({'display':'none'});
        	//$(this).prev().siblings(".info").hide();
        	//$(this).siblings(".test").hide();
        	/*$('div').filter('.test').each(function(i) {
        		$(this).removeClass('test');
        		//$(this).css({'display': 'none'});
        	});*/
        	$('div').filter('.info1, .info2').each(function(i) {
        		//$(this).removeClass('test');
        		$(this).css({'display': 'none'});
        	});
        	//$(this).next().addClass('test')
        	$(this)
            .next().show().animate({
              width: width+'%'
            })
            .siblings(".info").animate({
              width: 0
            });
        	$(this).next().find(".info1").css({'display': 'block'});
        	$(this).next().find(".info2").css({'display': 'block'});
        	el_node = $(this).next().find(".info2");
        	//$(this).closest('.test').css({'display': 'none'});
        	/*$(this)
            .prev(".info").css({'display': 'none'});*/
        	$(this).siblings(".item").css({'display': 'block'});
        });
       
        /** Back Icon */
        this.$('.back-icon').click(function(e){
        	self.gui.show_screen('firstpage');
        });
        
        /** Action for Dashboard Element */
        this.$('.dashboard-element').click(function(e){
        	var line_id = $(this).attr('id');
        	var vendor_categ_id = $(this).attr('categid');
        	var dashboard_id = $(this).attr('dashid');
        	var menu_name = $(this).attr('menu');
        	var color_code = $(this).attr('color');
        	var sub_id = 0;
        	var order_id = 0;
        	var form_fields_records;
        	//alert('Element');
        	$('div').filter('.highlight').each(function(i) {
        		$(this).removeClass('highlight');
        		$(this).css({'background-color': 'transparent'});
        		$(this).find('img').css({'filter': ''})
        	});
        	$(this).closest('div').css({'background-color': 'whitesmoke'});
        	$(this).closest('div').addClass('highlight');
        	$(this).closest('div img').css({'filter': 'opacity(0.5) drop-shadow(0 0 0 '+color_code+')'})
        	
        	self._rpc({
    			model: 'hm.form.template',
    			method: 'get_vendor_list',
    			args: [0,vendor_categ_id, dashboard_id, line_id, false, sub_id, order_id],
    		}).then(function(result){ 
    			var result_datas = result[0]['result_datas']
    			var line_group = result[0]['line_group']
    			var line_group_key = result[0]['line_group_key']
    			var form_view = result[0]['form_view']
    			var form_name = result[0]['form_name']
    			var color = result[0]['color']
    			var sub_form_template = result[0]['sub_form_template']
    			var current_order = result[0]['current_order']
    			var form_temp_id = result[0]['form_temp_id']
    			var model_name = result[0]['model_name']
    			
    			var contents = el_node.find('.vendor-contents');
                contents.innerHTML = "";
                var vendor_html = QWeb.render('VendorListContent',{widget: self, result_datas: result_datas, form_view: form_view,
                						form_name: form_name, color:color, sub_form_template: sub_form_template, current_order: current_order,
                						form_temp_id: form_temp_id, model_name: model_name,
                						line_group: line_group, line_group_key: line_group_key});
                var vendorlist = document.createElement('div');
                vendorlist.innerHTML = vendor_html;
                vendorlist = vendorlist.childNodes[1];
                contents.empty();
                contents.append(vendorlist);
               // alert(JSON.stringify(contents.html()))
               // alert("vendorlist"+JSON.stringify(vendorlist.html()))
               
                
                var table = el_node.find('#vendor_order_list').DataTable({
    		        //sScrollX: true,
    		       // sScrollXInner: "100%",
    		        //bScrollCollapse: true,
    		        bSort: false,
    		        //'rowsGroup': [0],
    		        bFilter: false,
    		        bPaginate: true, 
    		        pageLength: 10,
    			});
                
                /** Edit Option for DataTable */     
                contents.off('click','.edit-datatable'); 
                contents.on('click','.edit-datatable',function(){
                	//alert('test');
                	var sub_temp_id = $(this).attr('id');
                	var current_order_id = $(this).attr('orderid');
                	//alert('Edit'+current_order_id)
                	self._rpc({
            			model: 'hm.form.template',
            			method: 'get_vendor_list',
            			args: [0,vendor_categ_id, dashboard_id, 2, true, sub_temp_id, current_order_id],
            		}).then(function(result){ 
            			var result_datas = result[0]['result_datas']
            			var line_group = result[0]['line_group']
            			var line_group_key = result[0]['line_group_key']
            			var form_view = result[0]['form_view']
            			var form_name = result[0]['form_name']
            			var color = result[0]['color']
            			var sub_form_template = result[0]['sub_form_template']
            			var products = result[0]['products']
            			var template_lines = result[0]['template_lines']
            			var current_order = result[0]['current_order']     
            			var form_temp_id = result[0]['form_temp_id']
            			var model_name = result[0]['model_name']

            			
            			form_fields_records = template_lines;
            			
            			var fcontents = el_node.find('.vendor-contents');
        	        	fcontents.innerHTML = "";
        	        	var vendor_html = QWeb.render('VendorListContent',{widget: self, result_datas: result_datas, form_view: form_view,
    						form_name: form_name, color:color, sub_form_template: sub_form_template, products: products,
    						template_lines: template_lines, current_order: current_order, form_temp_id: form_temp_id, model_name: model_name,
    						line_group: line_group, line_group_key: line_group_key});
                        var vendorlist = document.createElement('div');
                        vendorlist.innerHTML = vendor_html;
                        vendorlist = vendorlist.childNodes[1];
                        fcontents.empty();
                        fcontents.append(vendorlist);
            		});
                });
                
                /** Action for Back Button */
                contents.off('click','.back-btn'); 
                contents.on('click','.back-btn',function(){
                	self._rpc({
            			model: 'hm.form.template',
            			method: 'get_vendor_list',
            			args: [0,vendor_categ_id, dashboard_id, line_id, false, sub_id, order_id],
            		}).then(function(result){ 
            			var result_datas = result[0]['result_datas']
            			var line_group = result[0]['line_group']
            			var line_group_key = result[0]['line_group_key']
            			var form_view = result[0]['form_view']
            			var form_name = result[0]['form_name']
            			var color = result[0]['color']
            			var sub_form_template = result[0]['sub_form_template']
            			var current_order = result[0]['current_order']
            			var form_temp_id = result[0]['form_temp_id']
            			var model_name = result[0]['model_name']
            			//alert('dashboard_id'+dashboard_id);
            			var contents = el_node.find('.vendor-contents');
                        contents.innerHTML = "";
                        var vendor_html = QWeb.render('VendorListContent',{widget: self, result_datas: result_datas, form_view: form_view,
                        						form_name: form_name, color:color, sub_form_template: sub_form_template, 
                        						current_order: current_order, form_temp_id: form_temp_id, model_name: model_name,
                        						line_group: line_group, line_group_key: line_group_key});
                        var vendorlist = document.createElement('div');
                        vendorlist.innerHTML = vendor_html;
                        vendorlist = vendorlist.childNodes[1];
                        contents.empty();
                        contents.append(vendorlist);
                        
                        var table = el_node.find('#vendor_order_list').DataTable({
            		        bSort: false,
            		        bFilter: false,
            		        bPaginate: true, 
            		        pageLength: 10,
            			});
            		});
                });
                /** Action for Vendors */
                contents.off('click','.vendor-form-icon');
                contents.on('click','.vendor-form-icon',function(){ 
                	var sub_temp_id = $(this).attr('id');
                	self._rpc({
            			model: 'hm.form.template',
            			method: 'get_vendor_list',
            			args: [0,vendor_categ_id, dashboard_id, 2, true, sub_temp_id, order_id],
            		}).then(function(result){ 
            			var result_datas = result[0]['result_datas']
            			var line_group = result[0]['line_group']
            			var line_group_key = result[0]['line_group_key']
            			var form_view = result[0]['form_view']
            			var form_name = result[0]['form_name']
            			var color = result[0]['color']
            			var sub_form_template = result[0]['sub_form_template']
            			var products = result[0]['products']
            			var template_lines = result[0]['template_lines']
            			var current_order = result[0]['current_order']
            			var form_temp_id = result[0]['form_temp_id']
            			var model_name = result[0]['model_name']
            			
            			form_fields_records = template_lines;
            			
            			var fcontents = el_node.find('.vendor-contents');
        	        	fcontents.innerHTML = "";
        	        	var vendor_html = QWeb.render('VendorListContent',{widget: self, result_datas: result_datas, form_view: form_view,
    						form_name: form_name, color:color, sub_form_template: sub_form_template, products: products,
    						template_lines: template_lines, current_order: current_order, form_temp_id: form_temp_id, model_name: model_name,
    						line_group: line_group, line_group_key: line_group_key});
                        var vendorlist = document.createElement('div');
                        vendorlist.innerHTML = vendor_html;
                        vendorlist = vendorlist.childNodes[1];
                        fcontents.empty();
                        fcontents.append(vendorlist);
            		});
    	        	
    	    	});
                
                /** Form */
                /*contents.on('click','.span-tag',function(){
                	$(this).css({'display': 'none'});
                	$(this).closest('td').find('.input-tag').css({'display': 'inline-block'});
                });*/
                contents.off('focus','.datepicker-input');
                contents.on('focus','.datepicker-input',function(){
                	$(this).datepicker({
            	   		//todayBtn: "linked"
                		format: 'yyyy-mm-dd',
            	   		todayHighlight: true
            	   	});
                });
                
                /** Remove Required */
                contents.off('focus','input');
                contents.on('focus','input',function(){
                	$(this).css({'border': '1px solid white'});
                	
                });
                
                /** On Change Function */
                contents.on('change','.selection-type',function(){
                	var id = $(this).find('option:selected').attr("id");
                	contents.find('#car-image').attr("src",'/web/image?model=hm.car.type&id='+id+'&field=image');
                });
                
                /** Set to Draft Action */
                contents.off('click','#order-draft');
                contents.on('click','#order-draft',function(){
                	var order_id = contents.find('#order_id').text();
                	var model_name = contents.find('#model_name').text();
                	
                	self._rpc({
            			model: 'hm.form.template',
            			method: 'set_draft_order',
            			args: [0, order_id, model_name],
            		}).then(function(result){
            			contents.find('#order-draft').css({'display': 'none'});
            			contents.find('#order-confirm').addClass('btn-active');
            			contents.find('#order-draft').removeClass('btn-active');
            			contents.find('#cancel').css({'display': 'none'});
            			contents.find('#open').addClass('active');
                    	contents.find('#cancel').removeClass('active');
                    	
            		});
                });
                
                /** Cancel Action */
                contents.off('click','#order-cancel');
                contents.on('click','#order-cancel',function(){
                	var order_id = contents.find('#order_id').text();
                	var model_name = contents.find('#model_name').text();
                	
                	self._rpc({
            			model: 'hm.form.template',
            			method: 'cancel_order',
            			args: [0, order_id, model_name],
            		}).then(function(result){
            			//console.log('result'+result)
            			contents.find('#order-draft').addClass('btn-active');
            			contents.find('#order-cancel').removeClass('btn-active');
            			contents.find('#order-draft').css({'display': 'block'});
            			contents.find('#cancel').css({'display': 'block'});
            			contents.find('#cancel').addClass('active');
                    	contents.find('#done').removeClass('active');
                    	
            		});
                });
               
                /** Confirm Action */
                contents.off('click','#order-confirm');
                contents.on('click','#order-confirm',function(){
                	var order_datas = {}
                	var error = false;
                	var order_id = contents.find('#order_id').text();
                	var form_temp_id = contents.find('#form_temp_id').text();
                	var model_name = contents.find('#model_name').text();
                	
                	$('table.order-form-detail').each(function() {
	                	for(var i=0; i<form_fields_records.length; i++){
	                		console.log('field'+ form_fields_records[i].form_fields)
	                		var field = form_fields_records[i].form_fields;
	                		var mandatory =form_fields_records[i].isMandatory;
	                		if(form_fields_records[i].form_field_type == 'label'){
	                			var value = $(this).find('span#'+form_fields_records[i].form_fields).text();
	                			order_datas[field] = value.trim();
	                		}
	                		if(form_fields_records[i].form_field_type == 'input_char'){
	                			var value = $(this).find('input#'+form_fields_records[i].form_fields).val();
	                			order_datas[field] = value;
	                			if(form_fields_records[i].form_fields == 'guest_name'){
	                				var value1 =  $(this).find('#product_id option:selected').attr("id");
	                				order_datas['product_id'] = value1;
	                				
	                			}
	                			if(!value && mandatory){
	                				error = true;
	                				$(this).find('input#'+form_fields_records[i].form_fields).css({'border': '1px solid red'});
	                			}
	                			//console.log('value'+value);
	                		}
	                		if(form_fields_records[i].form_field_type == 'date'){
	                			var value = $(this).find('input#'+form_fields_records[i].form_fields).val();
	                			order_datas[field] = value;
	                			if(!value && mandatory){
	                				error = true;
	                				$(this).find('input#'+form_fields_records[i].form_fields).css({'border': '1px solid red'});
	                			}
	                			//console.log('value'+value);
	                		}
	                		if(form_fields_records[i].form_field_type == 'selection'){
	                			var value1 =  $(this).find('#'+form_fields_records[i].form_fields+' option:selected').val();
	                			var value =  $(this).find('#'+form_fields_records[i].form_fields+' option:selected').attr("id");
	                			order_datas[field] = value;
	                			if(!value && mandatory){
	                				error = true;
	                				$(this).find('input#'+form_fields_records[i].form_fields).css({'border': '1px solid red'});
	                			}
	                			//console.log('value'+value);
	                			//console.log('value1:'+value1);
	                		}
	                	}
                	});
                	//console.log('Order Datas'+ JSON.stringify(order_datas));
                	if(!error){
	                	self._rpc({
	            			model: 'hm.form.template',
	            			method: 'create_order',
	            			args: [0,order_datas, order_id, form_temp_id, model_name],
	            		}).then(function(result){
	            			//console.log('result'+result)
	            			contents.find('#order_id').text(result);
	            			contents.find('#order-confirm').removeClass('btn-active');
	            			contents.find('#order-cancel').addClass('btn-active');
	            			contents.find('#order-draft').css({'display': 'none'});
	            			
	            			contents.find('#open').removeClass('active');
	                    	contents.find('#done').addClass('active');
	                    	contents.find('#cancel').css({'display': 'none'});
	            			//console.log('span:'+contents.find('#order_id').text())
	            		});
                	}
                });
    		});
        	       	
        });
        
    },
    dashboard_icon_url: function(id){
        return '/web/image?model=hm.vendor.dashboard&id='+id+'&field=image';
    },
    
    dashboard_line_icon_url: function(id){
        return '/web/image?model=hm.vendor.dashboard.line&id='+id+'&field=image';
    },
    
    get_dashboard_line: function(id){
    	return this.pos.db.get_dashboardline_by_dashboard(id);
    },
    
    get_vendors: function(category_id){
    	return this.pos.db.get_vendor_by_category(category_id);
    },
    
    vendor_image_url: function(id){
    	return '/web/image?model=res.partner&id='+id+'&field=image';
    },
    
    sub_template_icon_url: function(id){
    	return '/web/image?model=hm.sub.form.template&id='+id+'&field=image';
    },
    car_icon_url: function(id){
    	return '/web/image?model=hm.car.type&id='+id+'&field=image';
    },

    render_list: function(dashboards){
        var contents = this.$el[0].querySelector('.vendor-category');
        contents.innerHTML = "";
        var dashboard_html = QWeb.render('VendorDashboard',{widget: this, dashboards:dashboards});
        var dashboardline = document.createElement('div');
        dashboardline.innerHTML = dashboard_html;
        dashboardline = dashboardline.childNodes[1];
        contents.appendChild(dashboardline);
    },
   
  
});
gui.define_screen({name:'vendor_dashboard', widget: VendorDashboardScreenWidget});

});