import React, { useState } from 'react';
import OverviewConnect from '../components/OverviewConnect';
import Header from '../components/Header';

function Overview(){
    return (
        <div className='container'>
             {/* Header Row */}
             <div className='row justify-content-end'>
                <div className='col-6'>
                    <Header />
                </div>
            </div>
            <div className='row'>
                <div className='col'>
                <OverviewConnect/>
                </div>
            </div>
           

        </div>
    );
}



export default Overview;
