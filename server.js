const express=require("express"),fs=require("fs"),path=require("path");
const app=express(),PORT=process.env.PORT||3000;
const dataDir=path.join(__dirname,"data"),file=path.join(dataDir,"leads.json");
if(!fs.existsSync(dataDir))fs.mkdirSync(dataDir,{recursive:true});
if(!fs.existsSync(file))fs.writeFileSync(file,"[]");
app.use(express.json({limit:"150kb"}));
app.use(express.static(path.join(__dirname,"public")));
const read=()=>JSON.parse(fs.readFileSync(file,"utf8"));
const write=x=>fs.writeFileSync(file,JSON.stringify(x,null,2));
const clean=(v,n=1000)=>String(v??"").trim().slice(0,n);
app.get("/api/health",(_,res)=>res.json({ok:true,service:"fortune-lead-application",version:"2.0"}));
app.post("/api/leads",async(req,res)=>{
 const b=req.body||{},lead={...b,lead:{...b.lead, name:clean(b.lead?.name,120),phone:clean(b.lead?.phone,30),email:clean(b.lead?.email,160)},id:"FORTUNE-"+Date.now(),received_at:new Date().toISOString(),status:"new"};
 if(!lead.lead.name||!lead.lead.phone||!lead.lead.email||!b.investment_profile?.primary_interest||!b.investment_profile?.primary_goal||!b.financial_profile?.annual_income_range||!b.consent?.contact_consent)return res.status(400).json({ok:false,message:"Required lead information or consent is missing."});
 const leads=read();leads.push(lead);write(leads);
 if(process.env.N8N_WEBHOOK_URL){try{const r=await fetch(process.env.N8N_WEBHOOK_URL,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(lead)});if(!r.ok)console.error("n8n returned",r.status)}catch(e){console.error("n8n forwarding failed:",e.message)}}
 res.status(201).json({ok:true,lead_id:lead.id});
});
app.get("/api/leads",(_,res)=>res.json({ok:true,count:read().length,leads:read()}));
app.get("*",(_,res)=>res.sendFile(path.join(__dirname,"public","index.html")));
app.listen(PORT,()=>console.log(`Fortune application running at http://localhost:${PORT}`));