sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter"
], function (BaseController, MessageBox, Utilities, History, Filter) {
	"use strict";
	var res = '';
	var descbreve = '';
	return BaseController.extend("com.sap.build.standard.controleDeServicos.controller.Desc", {
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.controleDeServicos.view.Desc", this);
			this._bInit = false;
		},
		exit: function () {
			delete this._oView;
		},
		getView: function () {
			return this._oView;
		},
		getRouter: function () {
			return sap.ui.core.UIComponent.getRouterFor(this);
		},
		getControl: function () {
			return this._oControl;
		},
		getOwnerComponent: function () {
			return this._oView.getController().getOwnerComponent();
		},
		open: function (view) {
			this.view = view;
			var oView = this._oView;
			var oControl = this._oControl;
			var str = this._oView.byId("paginafuncionario").getHeaderTitle().getObjectSubtitle();
			res = str.split(" ");
			var Matricula = res[2];
			if (!this._bInit) {
				this.onInit(); // Inicializa o Fragmento
				this._bInit = true;
				oView.addDependent(oControl); // conectar fragmento à visualização raiz deste componente (models, lifecycle)
			}
			var args = Array.prototype.slice.call(arguments);
			if (oControl.open) {
				oControl.open.apply(oControl, args);
			} else if (oControl.openBy) {
				oControl.openBy.apply(oControl, args);
			}
		},
	
		close: function () {
			this._oControl.close();
		},
		
		setRouter: function (oRouter) {
			this.oRouter = oRouter;
		},
		
		getBindingParameters: function () {
			return {};
		},
		
		onInit: function () {
			this.oRouter = sap.ui.core.UIComponent.getRouterFor(this._oView);
			this._oDialog = this.getControl();
		}
	});
}, /* bExport= */ true);