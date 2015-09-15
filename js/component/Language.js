var LanguageTitle = React.createClass({
	componentDidMount: function(){
		jQuery("#modif_lang").bind("click", function(e){
			e.preventDefault();
			reactClickEvent("languages", "modif_lang");
			
			actionRemove = getSiteUrl() + "controller/SiteController.php?action=removelanguage"
			actionMove = getSiteUrl() + "controller/SiteController.php?action=moveitemlanguage"
			actionAddNew = getSiteUrl() + "controller/SiteController.php?action=addnewlanguage"
			actionSaveAll = getSiteUrl() + "controller/SiteController.php?action=updatelanguages"
							
			React.render(
				<AddLanguagePanelContent url="data/language.json"
							actionRemove={actionRemove}
							actionMove={actionMove}
							actionAddNew={actionAddNew}
							actionSaveAll={actionSaveAll}
							onRefresh={this.refreshBlock}
				/>, document.getElementById('modifyPanel-content')
			);
		}.bind(this));
	},
	refreshBlock: function(data){
		this.props.onRefresh(data);
	},
	render: function(){
		return(
			<div className="title">
				<div className="overlay">
					<a id="modif_lang" href="calljson.php">
						<span className="fa fa-pencil fa-2x"></span>
					</a>
				</div>
				<h2>// {this.props.title}</h2>
			</div>
		);
	}
});

var LanguageItem = React.createClass({
	render: function(){
		var style = {
			width:this.props.width + "%"
		};
		return (
			<div className="skill">{this.props.item}
                <div className="icon">
                    <div className="icon-red" style={style}></div>
                </div>
            </div>
		);
	}
});


var LanguageList = React.createClass({
	render: function(){
		var languageList = this.props.data.map(function(detail){
			return(
				<LanguageItem item={detail.item} width={detail.width} />
			);
		});
		return (
			<div className="language-skills">
				{languageList}
			</div>
		);
	}
});

var LanguageBox = React.createClass({
	
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
		$('.icon-red').each(function(){
			height = $(this).height();
			$(this).animate({
				height: 14,
			}, 2000);
		});
	},
	
	getInitialState: function(){
		return {
			data:[],
		}
	},
    
	refreshBlockView: function(data){
		this.setState({data:data});
	},
	
	render: function(){
		return(
			<div>
				<LanguageTitle title="Languages"
								onRefresh={this.refreshBlockView}/>
				<LanguageList data={this.state.data}/>
			</div>
		);
    }
});

/*Add/Modify panel content
 **/
var ItemLanguagePanel = React.createClass({
	
	removeHandler: function(index){
		//Cannot remove child by the code below with javascript traditionnal because the li element keeps it index when rendering
		//and it will not be updated with javascript function! Omg!
		//var list = document.getElementById('skill_lists');
		//list.removeChild(list.childNodes[index]);

		$.ajax({
			url:this.props.actionRemove,
			type: 'post',
			data:{index:index, dir:'data', file:'language.json'},
			success: function(data){
				if (data.charAt(0) != '-') {
					this.refreshView(JSON.parse(data));
				}
			}.bind(this),
			error: function(xhr, status, err){
				console.error('Err: Remove skill item', status, err.toString());
			}.bind(this)
		});
	},
	
	itemUp: function(index){
		$.ajax({
			url:this.props.actionMove,
			type:'post',
			data:{index:index, move:'up', dir:'data', file:'language.json'},
			success: function(data){
				if (data.charAt(0) != '-') {
					this.refreshView(JSON.parse(data));
				}
			}.bind(this),
			error: function(xhr, status, err){
				console.error('Err: Move item down', status, err.toString());
			}.bind(this)
		});
	},
	
	itemDown: function(index){
		$.ajax({
			url:this.props.actionMove,
			type:'post',
			data:{index:index, move:'down', dir:'data', file:'language.json'},
			success: function(data){
				if (data.charAt(0) != '-') {
					this.refreshView(JSON.parse(data));
				}
			}.bind(this),
			error: function(xhr, status, err){
				console.error('Err: Move item down', status, err.toString());
			}.bind(this)
		});
	},
	
	refreshView: function(data){
		this.props.onRefresh(data);
	},
	
	render: function(){
		return(
			<li className="first">
				<div>{this.props.item}</div>
				<input value={this.props.width} onChange="javascript:void(0)"/>
				<a onClick={this.itemUp.bind(this, this.props.index)}><span className="fa fa-arrow-circle-up fa-2x"></span></a>
                <a onClick={this.itemDown.bind(this, this.props.index)}><span className="fa fa-arrow-circle-down fa-2x"></span></a>
				<a onClick={this.removeHandler.bind(this, this.props.index)}><span className="fa fa-remove fa-2x"></span></a>
			</li>
		);
	}
});

var ItemLanguageListPanel = React.createClass({
	refreshView: function(data){
		this.props.onRefresh(data);
	},
	render: function(){
		var itemList = this.props.data.map(function(detail, index){
			return(
				<ItemLanguagePanel item={detail.item} width={detail.width}
								index={index}
								actionRemove={this.props.actionRemove}
								actionMove={this.props.actionMove}
								onRefresh={this.refreshView}/>
			);
		}, this);
		
		return(
			<ul id="language_lists">
				{itemList}
			</ul>
		);
	}
});

var AddLanguagePanelContent = React.createClass({
	refreshView: function(data){
		this.setState({data:data});
		
		//Refresh parent view (Block Languages)
		this.props.onRefresh(data);
		
		//Close panel
		closeProduct();
	},
	
	loadDataFromServer: function(){
		$.ajax({
			url: this.props.url,
			dataType:'json',
			success: function(data){
				this.setState({data:data});
			}.bind(this),
			error: function(xhr, status, err){
				console.error('Err: Load skills to panel content', status, err.toString());
			}.bind(this)
		});
	},
	
	componentDidMount: function(){
		//Load data at first time
		this.loadDataFromServer();
		
		//Submit data content
		jQuery('#f-add-language .btn-success').bind('click', function(e){
			e.preventDefault();
			
			//Get all element in list
			var skills = [];
			$('#language_lists').each(function(){
				$(this).find('li').each(function(){
					var current = $(this);
					if (current.children().size() > 0) {
						var item = {'width':current.children('input').val(), 'item':current.children('div').text()};
						skills.push(item);
					}
				});
			});
			
			var url = this.props.actionSaveAll;
			$.ajax({
				url:url,
				type:'post',
				data:{content:JSON.stringify(skills), dir:'data', file:'language.json'},
				success: function(data){
					if (data.charAt(0) != '-') {
						this.refreshView(JSON.parse(data));
					}
				}.bind(this),
				error: function(xhr, status, err){
					console.error('Err: Update skills', status, err.toString());
				}.bind(this)
			});
		}.bind(this));
	},
	
	getInitialState: function(){
		return{
			data:[],
		};
	},
	
	addNewItem: function(){
		var name = $('#f-add-language .left').val();
		var percent = $('#f-add-language .right').val();
		$.ajax({
			url:this.props.actionAddNew,
			type:'post',
			data:{name:name, percent:percent, dir:'data', file:'language.json'},
			success: function(data){
				if (data.charAt(0) != '-') {
					this.refreshView(JSON.parse(data));
					$('#f-add-language .left').val("");
					$('#f-add-language .right').val("");
				}
			}.bind(this),
			error: function(xhr, status, err){
				console.error('Err: Add new item language', status, err.toString());
			}.bind(this)
		});
	},
	
	render: function(){
		return (
			<div class="col-xs-12">
				<div id="f-add-language">
					<p>Add/Modify your languages:</p>
					
					<div className="title">
						<div className="first">Language</div>
						<div>Level</div>
					</div>
					
					<ItemLanguageListPanel data={this.state.data}
										actionRemove={this.props.actionRemove}
										actionMove={this.props.actionMove}
										onRefresh={this.refreshView}/>
					
					<div className="title">
						<input className="left" placeholder="Skill"/>
						<input className="right" placeholder="0" />
						<a onClick={this.addNewItem}><span className="fa fa-plus fa-2x"></span></a>
					</div>
					<p className="remark">(*) Level is between 0 and 100.</p>
					<button className="btn btn-success">Update</button>
				</div>
			</div>
		);
	}
});

/*Main
 **/
React.render(
    <LanguageBox url="data/language.json"/>, document.getElementById('languages')
);

