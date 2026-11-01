'use client'
import {useEffect,useState} from 'react'
import {getPublicProjects} from '@/lib/portfolio-client'
import {grid} from '@/lib/portfolio-html'
// Retained Next design preview. Deployed public HTML is rendered directly by Pages Functions.
export default function DynamicPortfolio({home=false}:{home?:boolean}){
 const [html,setHTML]=useState('<p>No project photographs are currently available.</p>')
 useEffect(()=>{getPublicProjects().then(projects=>setHTML(grid(home?projects.slice(0,6):projects))).catch(()=>setHTML('<p>Project photographs are temporarily unavailable. Please enquire to discuss your furniture.</p>'))},[home])
 return <div id={home?'home-projects':'portfolio-results'} dangerouslySetInnerHTML={{__html:html}}/>
}
