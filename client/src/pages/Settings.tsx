'use client';

import React, {useState} from 'react';
import {ArrowLeft, Plus, X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {Input} from '@/components/ui/input';
import {Badge} from '@/components/ui/badge';
import type {MainCategory} from '@/types/Categories';

interface SettingsProps {
    mainCategories: MainCategory[];
    onBack: () => void;
    onUpdateCategories: (categories: MainCategory[]) => void;
}

const Settings: React.FC<SettingsProps> = ({
                                               mainCategories,
                                               onBack,
                                               onUpdateCategories,
                                           }) => {
    const [newSub, setNewSub] = useState<{ [k: string]: string }>({});

    const addSub = (id: string) => {
        const name = newSub[id]?.trim();
        if (!name) return;
        const updated = mainCategories.map(c =>
            c.id === id
                ? {
                    ...c,
                    subcategories: [
                        ...c.subcategories,
                        {
                            id: `sub-${Date.now()}`,
                            name,
                            score: 5,
                            isCustom: true,
                            mainCategory: id,
                        },
                    ],
                }
                : c,
        );
        onUpdateCategories(updated);
        setNewSub(p => ({...p, [id]: ''}));
    };

    const removeSub = (cid: string, sid: string) =>
        onUpdateCategories(
            mainCategories.map(c =>
                c.id === cid
                    ? {...c, subcategories: c.subcategories.filter(s => s.id !== sid)}
                    : c,
            ),
        );

    return (
        <div className="min-h-screen w-full bg-gray-50">
            <div className="mx-auto max-w-5xl space-y-12 px-4 py-12 sm:px-6 lg:px-8">
                <div className="mb-10 flex items-center justify-between gap-4">
                    <div>
                        <h1 className="text-4xl font-extrabold text-gray-900">Settings</h1>
                        <p className="text-base text-gray-600">
                            Manage subcategories within your life areas.
                        </p>
                    </div>

                    <Button
                        onClick={onBack}
                        className="h-9 transform bg-gradient-to-r from-purple-500 via-indigo-500 to-blue-500 px-4 text-sm text-white shadow transition hover:scale-105 hover:brightness-110"
                    >
                        <ArrowLeft className="mr-2 h-4 w-4"/>
                        Back to Dashboard
                    </Button>
                </div>

                {mainCategories.map(cat => (
                    <div key={cat.id} className="relative mb-14">
                        <div
                            aria-hidden
                            className="pointer-events-none absolute -inset-0.5 z-0 rounded-[2rem] blur-lg opacity-45"
                            style={{
                                background: `radial-gradient(circle at 30% 30%, ${cat.color}AA 0%, transparent 70%)`,
                            }}
                        />
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0.5 z-0 rounded-[2rem] animate-orbit opacity-60"
                            style={{
                                background: `linear-gradient(70deg, ${cat.color}AA 0%, ${cat.color}DD 40%, ${cat.color}22 50%, ${cat.color}DD 80%)`,
                                backgroundSize: '300% 300%',
                                filter: 'blur(6px)',
                            }}
                        />

                        <div
                            className="relative z-10 space-y-6 rounded-3xl border border-gray-200 bg-white/80 p-6 shadow-xl backdrop-blur-lg">
                            <div className="flex items-center gap-3">
                <span
                    className="h-6 w-6 rounded-full"
                    style={{backgroundColor: cat.color}}
                />
                                <h3 className="text-xl font-semibold text-gray-900">{cat.name}</h3>
                                <Badge className="border border-gray-300 bg-white/70 text-xs text-gray-700">
                                    {cat.subcategories.length} subcategories
                                </Badge>
                            </div>

                            {/* add subcategory */}
                            <div className="rounded-xl bg-white/80 p-4 backdrop-blur-md">
                                <div className="flex items-end gap-3">
                                    <div className="flex-1">
                                        <label className="mb-1 block text-sm font-medium">
                                            Add New Subcategory
                                        </label>
                                        <Input
                                            placeholder="e.g., Leadership"
                                            value={newSub[cat.id] || ''}
                                            onChange={e =>
                                                setNewSub(p => ({...p, [cat.id]: e.target.value}))
                                            }
                                            onKeyDown={e => e.key === 'Enter' && addSub(cat.id)}
                                        />
                                    </div>
                                    <Button
                                        disabled={!newSub[cat.id]?.trim()}
                                        onClick={() => addSub(cat.id)}
                                        style={{backgroundColor: cat.color}}
                                        className="text-white"
                                    >
                                        <Plus className="mr-2 h-4 w-4"/>
                                        Add
                                    </Button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                                {cat.subcategories.map(sub => (
                                    <div
                                        key={sub.id}
                                        className="flex items-center justify-between rounded-xl border bg-white p-4"
                                    >
                                        <span className="font-medium text-gray-800">{sub.name}</span>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => removeSub(cat.id, sub.id)}
                                            className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                                        >
                                            <X className="h-4 w-4"/>
                                        </Button>
                                    </div>
                                ))}
                            </div>

                            {cat.subcategories.length === 0 && (
                                <p className="py-6 text-center italic text-gray-500">
                                    No subcategories yet. Add your first one above!
                                </p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Settings;
