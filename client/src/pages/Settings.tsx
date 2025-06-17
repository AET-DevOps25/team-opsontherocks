'use client';

import { useEffect, useState, useCallback } from 'react';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import type { MainCategory } from '@/types/Categories';

/**
 * Settings page that shows **exactly four life‑area cards** (Career, Relationships, Health, Other),
 * matching your original gradients. All sub‑category CRUD is wired to the Spring controller at
 * `${VITE_SERVER_URL}/users/me/categories`.
 *
 * Detailed `console.log` statements help trace every step.
 */
interface SettingsProps { onBack: () => void; }

interface CategoryFromApi {
    id: number;
    name: string;
    categoryGroup: 'Career' | 'Relationships' | 'Health' | 'Other';
}

const PRESET_GROUPS = [
    { id: 'Career',        label: 'Career',        color: '#8B5CF6' },
    { id: 'Relationships', label: 'Relationships',color: '#06B6D4' },
    { id: 'Health',        label: 'Health',        color: '#10B981' },
    { id: 'Other',         label: 'Other',         color: '#F59E0B' },
] as const;

type GroupId = (typeof PRESET_GROUPS)[number]['id'];

export default function Settings({ onBack }: SettingsProps) {
    /* state */
    const [categories, setCategories] = useState<MainCategory[]>([]);
    const [newSub, setNewSub] = useState<Record<string, string>>({});
    const [loading, setLoading]   = useState(true);
    const [error, setError]       = useState<string|null>(null);

    /* api helper */
    const SERVER = import.meta.env.VITE_SERVER_URL as string | undefined;
    const base   = SERVER ? `${SERVER}/users/me/categories` : undefined;
    const api = useCallback(<T,>(path:string, opts:RequestInit={}):Promise<T>=>{
        if(!base) return Promise.reject(new Error('VITE_SERVER_URL not set')) as Promise<T>;
        const url = `${base}${path}`;
        console.log('[Settings] →', opts.method ?? 'GET', url, opts.body ?? '');
        return fetch(url,{credentials:'include',headers:{'Content-Type':'application/json',...(opts.headers||{})},...opts})
            .then(async res=>{
                const txt = await res.clone().text();
                console.log('[Settings] ←',res.status,url,txt);
                if(!res.ok) throw new Error(txt||res.statusText);
                return (res.status===204? (undefined as unknown as T): JSON.parse(txt)) as T;
            });
    },[base]);

    /* fetch */
    const refresh = useCallback(async()=>{
        try{
            setLoading(true);
            const raw = await api<CategoryFromApi[]>('',{method:'GET'});
            const grouped: Record<GroupId, CategoryFromApi[]> = {Career:[],Relationships:[],Health:[],Other:[]};
            raw.forEach(c=>{
                const key = (c.categoryGroup||'') as GroupId;
                if(key in grouped) grouped[key].push(c);
                else console.warn('Unknown group',c);
            });
            const ui: MainCategory[] = PRESET_GROUPS.map(g=>({
                id:g.id,name:g.label,color:g.color,
                subcategories: grouped[g.id].map(c=>({id:String(c.id),name:c.name,score:5,mainCategory:g.id}))
            }));
            setCategories(ui);
            setError(null);
        }catch(e:any){setError(e.message)}
        finally{setLoading(false)}
    },[api]);

    useEffect(()=>{refresh();},[refresh]);

    /* mutations */
    const addSub = async(groupId:GroupId)=>{
        const name=newSub[groupId]?.trim();
        if(!name) return;
        setNewSub(p=>({...p,[groupId]:''}));
        try{
            await api('',{method:'POST',body:JSON.stringify({name,categoryGroup:groupId})});
            await refresh();
        }catch(e){console.error(e);} }

    const removeSub = async(id:string)=>{
        const numeric = parseInt(id,10);
        if(isNaN(numeric)){console.warn('removeSub: not a numeric id',id);return;}
        try{
            await api(`/${numeric}`,{method:'DELETE'});
            await refresh();
        }catch(e){console.error(e);} };

    /* render */
    if(loading) return <p className="p-6 text-gray-500">Loading…</p>;
    if(error)   return <p className="p-6 text-red-600">{error}</p>;

    return(
        <div className="min-h-screen w-full bg-gray-50">
            <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
                {/* header */}
                <div className="mb-10 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900">Settings</h1>
                        <p className="text-base text-gray-600">Manage subcategories within your life areas.</p>
                    </div>
                    <Button onClick={onBack} className="h-9 transform bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 px-4 text-sm text-white shadow transition hover:scale-105 hover:brightness-110"><ArrowLeft className="mr-2 h-4 w-4"/>Back to Dashboard</Button>
                </div>

                {categories.map(cat=>(
                    <div key={cat.id} className="relative mb-14">
                        <div aria-hidden className="pointer-events-none absolute -inset-0.5 z-0 rounded-[2rem] blur-lg opacity-45" style={{background:`radial-gradient(circle at 30% 30%, ${cat.color}AA 0%, transparent 70%)`}}/>
                        <div aria-hidden className="pointer-events-none absolute inset-0.5 z-0 rounded-[2rem] animate-orbit opacity-60" style={{background:`linear-gradient(70deg, ${cat.color}AA 0%, ${cat.color}DD 40%, ${cat.color}22 50%, ${cat.color}DD 80%)`,backgroundSize:'300% 300%',filter:'blur(6px)'}}/>

                        <div className="relative z-10 space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-xl backdrop-blur-lg">
                            <div className="flex items-center gap-3"><span className="h-6 w-6 rounded-full" style={{backgroundColor:cat.color}}/><h3 className="text-xl font-semibold text-gray-900">{cat.name}</h3><Badge className="border border-gray-300 bg-white/70 text-xs text-gray-700">{cat.subcategories.length} subcategories</Badge></div>

                            <div className="rounded-xl bg-white/80 p-4 backdrop-blur-md"><div className="flex items-end gap-3"><div className="flex-1"><label className="mb-1 block text-sm font-medium">Add New Subcategory</label><Input placeholder="e.g., Leadership" value={newSub[cat.id]??''} onChange={e=>setNewSub(p=>({...p,[cat.id]:e.target.value}))} onKeyDown={e=>e.key==='Enter'&&addSub(cat.id as GroupId)}/></div><Button disabled={!newSub[cat.id]?.trim()} onClick={()=>addSub(cat.id as GroupId)} style={{backgroundColor:cat.color}} className="text-white"><Plus className="mr-2 h-4 w-4"/>Add</Button></div></div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">{cat.subcategories.map(sub=>(<div key={sub.id} className="flex items-center justify-between rounded-xl border bg-white p-4"><span className="font-medium text-gray-800">{sub.name}</span><Button variant="ghost" size="sm" onClick={()=>removeSub(sub.id)} className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"><X className="h-4 w-4"/></Button></div>))}</div>

                            {cat.subcategories.length===0&&<p className="py-6 text-center italic text-gray-500">No subcategories yet. Add your first one above!</p>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
