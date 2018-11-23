import React, { Component } from 'react';

class WorkOrderList extends Component {
    constructor(props) {
        super(props);
        this.state = {  content : [
            {
                woNumber: 'wo0001',
                recipeName: 'Chocolate Macaroons',
                startDate: '01/01/80',
                actualHours: 5
            },

            
        ]};
    }
    render() { 
        return ( <div></div> );
    }
}
 
export default WorkOrderList;