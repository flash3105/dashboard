import React from 'react';
import Chart from '../components/Chart';
import Header from '../components/Header';

function Geospatial(){
    return (
        <div className='container'>
                <div className='row justify-content-end  '>
            
            <div className='col-6 ' >
                <Header/>
            </div>
        </div>
        <div className='row'>
            <div className='col'>
            <Chart/>
            </div>
        </div>
            

        </div>
    );
}

export default Geospatial;