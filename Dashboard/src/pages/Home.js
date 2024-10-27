import React from 'react';
import NetworkStats from '../components/Networkstats';
import Section from '../components/Section';
import Header from '../components/Header';
import TopISPs from '../components/TopISPs';
import TopPlaces from '../components/TopPlaces';
import './Home.css'

function Home(){
    return (
        <div className='container'>
           
        <div className='row justify-content-end  '>
            
            <div className='col-6 ' >
                <Header/>
            </div>
        </div>
        <div className='row'>
            <div className='col'>
            <NetworkStats/>
            </div>
           
        </div>
        <div className='row'>
        <div className='col'>
              <Section/>

            </div>
           
        </div>
        <div className='row'>
        <div className='col'>
            <TopPlaces/>
            </div>
            <div className='col'>
            <TopISPs/>
            </div>
        </div>
    </div>
    );
}

export default Home;