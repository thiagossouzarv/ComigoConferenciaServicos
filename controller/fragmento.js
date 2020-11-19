sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/m/MessageBox",
	"./utilities",
	"sap/ui/core/routing/History",
	"sap/ui/model/Filter"
], function (BaseController, MessageBox, Utilities, History, Filter) {
	"use strict";
	var res = '';
	return BaseController.extend("com.sap.build.standard.controleDeServicos.controller.fragmento", {
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.controleDeServicos.view.fragmento", this);
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
			var MatriculaSupervisor = this._oView.getController().MatriculaSupervisor;
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
			this._oView.byId("listafun2").getBinding("items").attachChange(function (oEvent) {
				sap.ui.getCore().byFieldGroupId("listafun2")[0].setBusy(false);
			});
			var aFilters = [];
			aFilters.push(new Filter("Matricula", sap.ui.model.FilterOperator.EQ, MatriculaSupervisor));
			this._oView.byId("listafun2").getBinding("items").filter(aFilters);
			this._oView.byId("listafun2").getBinding("items").refresh = true;
		},
		ConcluirOperacao: function (oEvent) {
			var Operacao = {};
			var erro = 0;
			Operacao.NumeroOperacao = this.NumeroOperacao;
			Operacao.Notificador    = this.Notificador;
		//	Operacao.DataInicio     = this.DataInicio;
			Operacao.PrioridadeOrdem = this.PrioridadeOrdem;
			Operacao.DescricaoOrdem = this._oView.byId("listafun2").getValue().split('/')[0];
			Operacao.DescricaoBreve = this._oView.byId("area0").getValue();
			Operacao.CentroCusto = this.CentroCusto;
			Operacao.MatriculaFuncionario = this._oView.byId("Funcionario").getObjectSubtitle().split(' ')[2];
			Operacao.NumeroOrdem = this._oView.byId("listafun2").getValue().split('/')[1];
			var sUrl = "/sap/opu/odata/sap/ZAPP_CONTROLE_SERVICOS_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
			oModel.create("/OperacoesSet", Operacao, null, function (result) {
				erro = 0;
				MessageBox.success("Operação criada com sucesso.");
			}, function () {
				erro = 1;
				MessageBox.error("Erro ao gravar a Operação!");
			});
			if (erro == 0) {
				this.close();
			}

		},
		close: function () {
			this._oControl.close();
			this._oView.byId('area2').setValue('');
			var refreshlist = this._oView.byId('listaOperacao');
			refreshlist.getModel().refresh(true);
			//this._oView.byId('listafun2').getSelectedItem().setText();
			this._oView.byId('listafun2').setSelectedKey();
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