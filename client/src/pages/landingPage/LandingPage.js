import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReactFullpage from '@fullpage/react-fullpage';
import './landing_page.scss';
import { apiUrl } from '../../contexts/constants';
import Section1 from '../../components/landingPage/section1/Section1';
import Section2 from '../../components/landingPage/section2/Section2';
import Section3 from '../../components/landingPage/section3/Section3';
import Section4 from '../../components/landingPage/section4/Section4';

const LandingPage = () => {
    const [info, setInfo] = useState({});

    useEffect(() => {
        const loadInfo = async () => {
            const response = await axios.get(`${apiUrl}/vit`);

            if (response.data.success) {
                setInfo(response.data.data[0]);
            }
        };

        loadInfo();
    }, []);

    return (
        <ReactFullpage
            fixedElements="#fixed-element"
            render={({ state, fullpageApi }) => {
                return (
                    <>
                        <div id="fixed-element" style={{ position: "absolute", bottom: "40px", right: "80px", zIndex: 10}}>
                            VVV Read more VVV
                        </div>
                        <div className="landingPage">
                            <Section1 info={info} />
                            <Section2 info={info} />
                            <Section3 info={info} />
                            <Section4 info={info} />
                        </div>
                    </>
                );
            }}
        />
    );
};

export default LandingPage;
