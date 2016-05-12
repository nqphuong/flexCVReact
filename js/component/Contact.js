var ContactTitle = React.createClass({
    componentDidMount: function(){
        jQuery("#modif_cont_add").bind("click", function(e){
            e.preventDefault();
            var action = getSiteUrl() + "controller/SiteController.php?action=addnewcontact";
            var mode = "new";

            reactClickEvent("contact", "modif_cont_add");
            React.render(
                <AddContactPanelContent
                    action={action} mode={mode} info="" description="" icon=""
                    onRefresh={this.refreshParentView}/>,
                document.getElementById('modifyPanel-content')
            );

            return false;
        }.bind(this));
    },
    refreshParentView: function(data){
        this.props.onUpdate(data);
        closeProduct();
    },
    render: function(){
        return(
            <div className="title">
                {allowModif() ?
                    <div className="overlay">
                        <a id="modif_cont_add" href="calljson.php">
                            <span className="fa fa-plus-square fa-2x"></span>
                        </a>
                    </div> : ''
                }
                <h2>// {this.props.title}</h2>
            </div>
        );
    }
});

var ContactItem = React.createClass({
    removeHandler: function(index){
        var url = this.props.actionRemove;
        $.ajax({
            url:url,
            type:'post',
            data:{index:index, dir:'data', file:'contact.json'},
            success: function(data){
                if (data.charAt(0) != '-') {
                    this.refreshView(JSON.parse(data));
                }
            }.bind(this),
            error: function(xhr, status, err){
                console.error('Err: Remove contact item', status, err.toString);
            }.bind(this)
        });
    },
    updateHandler: function(index){
        this.showPanel(index);
    },
    refreshView: function(data){
        this.props.onUpdate(data);
    },
    //Show modification panel
	showPanel:function(index){
		var action = this.props.actionUpdate;
		var mode = "update";
		reactClickEvent("contact", "modif_cont_add");
		React.render(
			<AddContactPanelContent
				action={action} mode={mode} index={index}
				info={this.props.info}
				description={this.props.description}
				icon={this.props.icon}
                onRefresh={this.refreshView}/>,
			document.getElementById('modifyPanel-content')
		);
	},
    render: function(){
        //var overlay = allowModif() ? <OverlayOnItemContact /> : '';
        return(
            <div className="contact-item">
                {allowModif() ?
                    <div className="overlay">
                        <a id="modif_cont_remove" onClick={this.removeHandler.bind(this, this.props.index)}>
                            <span className="fa fa-eye-slash fa-2x"></span>
                        </a>
                        <a id="modif_cont_change" onClick={this.updateHandler.bind(this, this.props.index)}>
                            <span className="fa fa-pencil fa-2x m-r-5px"></span>
                        </a>
                    </div> : ''
                }
                <div className="item-icon">
                    <span className={this.props.icon}></span>
                </div>
                <div className="item-text">{this.props.info}</div>
                <div className="item-description">{this.props.description}</div>
            </div>
        );
    }
});

var ContactList = React.createClass({
    updateHandler: function(data){
        this.props.onUpdate(data);
    },
    render: function(){
        var contactList = this.props.data.map(function(detail, index){
            return(
                <ContactItem icon={detail.icon}
                                info={detail.info}
                                description={detail.description}
                                index={index}
                                actionRemove={this.props.actionRemove}
                                actionUpdate={this.props.actionUpdate}
                                onUpdate={this.updateHandler}/>
            );
        }, this);
        return(
            <div>
                {contactList}
            </div>
        );
    }
});

var ContactBox = React.createClass({

    loadDataFromServer: function(){
        $.ajax({
            url: this.props.url,
            dataType: 'json',
            success: function(data){
                this.setState({data:data});
            }.bind(this),
            error: function(xhr, status, err){
                console.error(xhr, status, err.toString());
            }.bind(this)
        });
    },

    componentDidMount: function(){
        this.loadDataFromServer();
    },

    getInitialState: function(){
        return {
            data:[]
        }
    },

    updateHandler: function(data){
        this.setState({data:data});
    },
    render: function(){
        return (
            <div>
                <ContactTitle title="Contact"
                                onUpdate={this.updateHandler}/>
                <ContactList data={this.state.data}
                            actionRemove={this.props.actionRemove}
                            actionUpdate={this.props.actionUpdate}
                            onUpdate={this.updateHandler}/>
            </div>
        );
    }
});

/**Add new content panel
 */
var AddContactPanelContent = React.createClass({
	componentDidMount: function(){
		//Mount submit function to html element after rendering
		var url = this.props.action;
		var mode = this.props.mode;
		var updateIndex = this.props.index;
		jQuery('#f-add-contact').submit(function(){
			var info = $('#f-add-contact .continfo').val();
			var description = $('#f-add-contact .contdesc').val();
			var icon = $('#f-add-contact .conticon').val();

			//Initial values tranfered
			var data = {};
			if (mode == 'new') {
				data = {info:info, description:description, icon:icon, dir:'data', file:'contact.json'};
			} else {
				data = {info:info, description:description, icon:icon, dir:'data', file:'contact.json', index:updateIndex};
			}

			$.ajax({
				url: url,
				type: "post",
				data: data,
				success: function(data){
                    if (data.charAt(0) != '-') {
                        this.refreshParentView(JSON.parse(data));
                    }
				}.bind(this),
				error: function(xhr, status, err){
					console.error(url, status, err.toString());
				}.bind(this)
			});

            return false;
		}.bind(this));
	},
    refreshParentView: function(data){
        this.props.onRefresh(data);
        closeProduct();
    },
	render: function(){
		return(
			<div class="row">
				<div class="col-xs-12">
					<form id="f-add-contact" method="post">
						<p>Add/Modify your contact info:</p>
						<p>Information:</p>
						<input className="continfo" type="text" placeholder="Text" defaultValue={this.props.info}/><p></p>

						<p>Description:</p>
						<textarea className="contdesc" placeholder="Text" defaultValue={this.props.description}></textarea><p></p>

						<p>Icon(bootstrap):</p>
						<input className="conticon m-b-10px" type="text" placeholder="Ex: fa fa-skype fa-fw" defaultValue={this.props.icon}/><p></p>

						<button className="btn btn-success">Update</button>
					</form>
				</div>
			</div>
		);
	}
});

/*Main
 **/
var actionRemove = getSiteUrl() + "controller/SiteController.php?action=removecontact";
var actionUpdate = getSiteUrl() + "controller/SiteController.php?action=updatecontact";
React.render(
    <ContactBox url="data/contact.json"
                actionRemove={actionRemove}
                actionUpdate={actionUpdate}
    />, document.getElementById('contact')
);
