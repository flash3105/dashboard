import React from 'react';
import './articles.css'; // Define styles here

const articles = [
    { title: 'Deep Learning Traffic Classification in Resource-Constrained Community Networks.', author: 'Dicks, M., & Chavula, J.', link: 'https://ieeexplore.ieee.org/abstract/document/9570875?casa_token=InsseXh4_6YAAAAA:Uz8UurYvtNfEGpRVITA8kUT_ZYRnWR6TpU1JTvq-2OeovKV6hzULP2MSH3bFJPmTMJSLl6JKSps' },
    { title: 'A first look at local and Internet traffic usage.', author: 'Phokeer, A., Hadzic, S., Nitschke, E., Van Zyl, A., Johnson, D., Densmore, M., & Chavula, J.', link: 'https://pubs.cs.uct.ac.za/id/eprint/1410/1/compass2020-first-look-preprint.pdf' },
    { title: 'Understanding Latency and Bandwidth', author: 'Digital Samba', link: 'https://www.digitalsamba.com/blog/understanding-latency-and-bandwidth-unveiling-the-key-differences#:~:text=Latency%20affects%20responsiveness%20and%20delays,rate%20achievable%20on%20the%20network.' }
];

const researches = [
    { title: 'Internet QoS Measurements and Network Engineering', author: 'Chavula, J', link: 'https://www.josiahchavula.com/research-projects/' },
    { title: 'State of Internet Measurement in Africa - A Survey', author: 'Musab Isah1, Amreesh Phokeer, Josiah Chavula, Ahmed Elmokashfi, and lemnew Sheferaw Asrese', link: 'https://pubs.cs.uct.ac.za/id/eprint/1375/1/State_of_Internet_Measurement_in_Africa_-_A_Survey.pdf' },
    { title: 'The Future of Network Optimization', author: 'Network Insights Lab', link: 'https://arxiv.org/abs/2301.09567' }
];

const resources = [
    { name: 'MLAB', description: 'Public platform for measuring Internet performance', link: 'https://www.measurementlab.net/' },
    { name: 'Ripe Atlas', description: 'Global network measurement platform', link: 'https://atlas.ripe.net/' },
    { name: 'Ookla Speedtest', description: 'Global speed test platform', link: 'https://www.speedtest.net/' }
];

const Information = () => {
    return (
        <div className='insights-container'>
            <h2>Network Performance Insights</h2>
            
            <section className='insights-section'>
                <h3>Key Articles</h3>
                <table className='insights-table'>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {articles.map((article, index) => (
                            <tr key={index}>
                                <td>{article.title}</td>
                                <td>{article.author}</td>
                                <td><a href={article.link} target="_blank" rel="noopener noreferrer">Read Article</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
            
            <section className='insights-section'>
                <h3>Research Papers</h3>
                <table className='insights-table'>
                    <thead>
                        <tr>
                            <th>Title</th>
                            <th>Author</th>
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {researches.map((research, index) => (
                            <tr key={index}>
                                <td>{research.title}</td>
                                <td>{research.author}</td>
                                <td><a href={research.link} target="_blank" rel="noopener noreferrer">Read Research</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>

            <section className='insights-section'>
                <h3>Helpful Resources</h3>
                <table className='insights-table'>
                    <thead>
                        <tr>
                            <th>Site Name</th>
                            <th>Description</th>
                            <th>Link</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.map((resource, index) => (
                            <tr key={index}>
                                <td>{resource.name}</td>
                                <td>{resource.description}</td>
                                <td><a href={resource.link} target="_blank" rel="noopener noreferrer">Visit</a></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </section>
        </div>
    );
};

export default Information;
