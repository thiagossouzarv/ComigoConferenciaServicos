sap.ui.define([
	"sap/ui/base/ManagedObject",
	"sap/m/MessageBox",
	"sap/ui/model/Filter",
	"./utilities",
	"sap/ui/core/routing/History"
], function (ManagedObject, MessageBox, Filter, Utilities, History) {
	var res = '';
	var DescricaoBreve = '';
	var Centro = '';
	var Matricula = '';
	var NumeroOrdem = '';
	return ManagedObject.extend("com.sap.build.standard.controleDeServicos.controller.Fun", {
		constructor: function (oView) {
			this._oView = oView;
			this._oControl = sap.ui.xmlfragment(oView.getId(), "com.sap.build.standard.controleDeServicos.view.Fun", this);
			this._bInit = false;

		},

		exit: function () {
			delete this._oView;
		},

		getView: function () {
			return this._oView;
		},

		getControl: function () {
			return this._oControl;
		},

		getOwnerComponent: function () {
			return this._oView.getController().getOwnerComponent();
		},

		open: function () {
			
			var oView = this._oView;
			var oControl = this._oControl;
			var str = this.getView().byId("paginaservico").getTitle();
			res = str.split(" - ");
			var Matricula = res[0];
			

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
			
			this.getView().byId("listafun").getBinding("items").attachChange(function (oEvent) {
				sap.ui.getCore().byFieldGroupId("listafun")[0].setBusy(false);
			});
			
			var aFilters = [];
			aFilters.push(new Filter("Hierarquia", sap.ui.model.FilterOperator.EQ, Matricula));
			this.getView().byId("listafun").getBinding("items").filter(aFilters);
			this.getView().byId("listafun").getBinding("items").refresh = true;
			
		

		},

		close: function () {
			this._oControl.close();
			this._oView.byId('area0').setValue('');
			this.getView().byId('listafun').getSelectedItem().setText("");
			this.getView().byId('listafun').setSelectedKey();
			
			
		},

		setRouter: function (oRouter) {
			this.oRouter = oRouter;

		},
		getBindingParameters: function () {
			
			return {};
		},
		ConcluirOperacao: function (oEvent) {
			var Operacao = {};
			var erro = 0;
	    	Operacao.NumeroOperacao = this.NumeroOperacao;
			Operacao.Notificador    = this.Notificador;
		//	Operacao.DataInicio     = this.DataInicio;
			Operacao.PrioridadeOrdem = this.PrioridadeOrdem;
			Operacao.DescricaoOrdem = this.getView().byId("listaServico").getSelectedItem().getTitle().split('-')[1];
			Operacao.DescricaoBreve = this.getView().byId("area0").getValue();
			Operacao.CentroCusto = this.CentroCusto;
			Operacao.MatriculaFuncionario = this.getView().byId("listafun").getSelectedKey();
			Operacao.NumeroOrdem = this.getView().byId("listaServico").getSelectedItem().getTitle().split('-')[0];
			var sUrl = "/sap/opu/odata/sap/ZAPP_CONTROLE_SERVICOS_SRV/";
			var oModel = new sap.ui.model.odata.ODataModel(sUrl, true);
			oModel.create("/OperacoesSet", Operacao, null, function (result) {
				MessageBox.success("Operação criada com sucesso.");
				erro = 0;
			}, function () {
				erro = 1;
				MessageBox.error("Erro ao gravar a Operação!");
			});
			if (erro == 0) {
				this.close();
			}
            this.getView().byId('listafun').getSelectedItem().setText("");
            this.getView().byId('listafun').setSelectedKey();
	
		},
		onInit: function () {

			this._oDialog = this.getControl();

		},
		onExit: function () {
			this._oDialog.destroy();

		}

	});
}, /* bExport= */ true);