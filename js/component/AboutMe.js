/**Home
 */
var AboutMe = React.createClass({
	loadDataFromServer: function(){
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: function(data){
				this.setState({data:data});
			}.bind(this),
			error: function(xhr, status, err){
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},

	componentDidMount: function(){
		this.loadDataFromServer();

		jQuery("#modif_aboutme").bind("click", function(e){
			e.preventDefault();

			//Show popup panel
			reactClickEvent("aboutme", "modif_aboutme");

			var action = getSiteUrl() + "controller/SiteController.php?action=updatecontent";
			//Render component
			React.render(
				<ModifyPanelContent url="data/aboutme.json"
									action={action}
									onRefresh={this.refreshView}
				/>,
				document.getElementById('modifyPanel-content')
			);
		}.bind(this));
	},

	refreshView: function(data){
		this.setState({data:data});
	},

	getInitialState: function(){
		return {
			data:[],
		}
	},

    render: function(){
		var content = this.state.data.map(function(detail){
			return(
				<p>{detail.content}</p>
			);
		});

		var overlay = allowModif() ? <Overlay /> : '';

		return(
            <div className="title">
				{overlay}
				<h2>// {this.props.title}</h2>
				{content}
			</div>
        );
    }
});

var Overlay = React.createClass({
	render: function(){
		return (
			<div className="overlay">
				<a id="modif_aboutme">
					<span className="fa fa-pencil fa-2x"></span>
				</a>
			</div>
		);
	}
});

/**Popup content
 */
var ModifyPanelContent = React.createClass({

	loadDataFromServer: function(){
		$.ajax({
			url: this.props.url,
			dataType: 'json',
			success: function(data){
				this.setState({data:data});
			}.bind(this),
			error: function(xhr, status, err){
				console.error(this.props.url, status, err.toString());
			}.bind(this)
		});
	},

	componentDidMount: function(){
		this.loadDataFromServer();
	},

	componentDidUpdate: function(){
		var url = this.props.action;
		console.log(url);
		jQuery("#f-about-me").submit(function(){
			var content = $("#f-about-me textarea").val();
			if (content == "") {
				alert("Err: Invalid content!");
			} else {
				$.ajax({
					type: "POST",
					url: url,
					data:{content:content, dir:'data', file:'aboutme.json'},
					success: function(data){
						if (data.charAt(0) != '-') {
							this.refreshParentView(JSON.parse(data));
						}
					}.bind(this),
					error: function(xhr, status, err){
						console.error('AboutMe Submit Error!', status, err.toString());
					}.bind(this)
				});
			}

			return false;
		}.bind(this));
	},

	refreshParentView: function(data){
		this.props.onRefresh(data);
		closeProduct();
	},

	getInitialState: function(){
		return{
			data:[],
		}
	},

	render: function(){
		var content = this.state.data.map(function(detail){
			return(
				<textarea className="m-b-10px">{detail.content}</textarea>
			);
		});
		return (
			<div class="row">
				<div class="col-xs-12">
					<form id="f-about-me" method="post">
						<p>Write new content:</p>
						{content}
						<button className="btn btn-success" >Update</button>
					</form>
				</div>
			</div>
		);
	}
});

/*Main
 **/
React.render(
    <AboutMe url="data/aboutme.json" title="About me"/>, document.getElementById('aboutme')
);
