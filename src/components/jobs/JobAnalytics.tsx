import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, MapPin, Clock, ChevronDown, BarChart3 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
} from 'recharts';

interface Job {
    id: string;
    title: string;
    location: string;
    job_type: string;
    job_function?: string;
}

interface JobAnalyticsProps {
    jobs: Job[];
}

const COLORS = ['#1e3a5f', '#c9a227', '#2563eb', '#16a34a', '#dc2626', '#9333ea', '#f59e0b'];

export function JobAnalytics({ jobs }: JobAnalyticsProps) {
    const [showCharts, setShowCharts] = useState(false);

    // Calculate stats
    const totalJobs = jobs.length;

    // Group by location
    const locationData = jobs.reduce((acc, job) => {
        const location = job.location.split(',')[0].trim(); // Get city
        acc[location] = (acc[location] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const locationChartData = Object.entries(locationData)
        .map(([name, value]) => ({ name, value }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 5); // Top 5 locations

    // Group by job type
    const typeData = jobs.reduce((acc, job) => {
        acc[job.job_type] = (acc[job.job_type] || 0) + 1;
        return acc;
    }, {} as Record<string, number>);

    const typeChartData = Object.entries(typeData)
        .map(([name, value]) => ({ name, value }));

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
        >
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="bg-gradient-to-br from-primary to-navy-medium border-0">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-lg">
                                <Briefcase className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-white/70">Open Positions</p>
                                <p className="text-3xl font-bold text-white">{totalJobs}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary to-navy-medium border-0">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-lg">
                                <MapPin className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-white/70">Locations</p>
                                <p className="text-3xl font-bold text-white">{Object.keys(locationData).length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="bg-gradient-to-br from-primary to-navy-medium border-0">
                    <CardContent className="p-5">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white/10 rounded-lg">
                                <Clock className="h-6 w-6 text-white" />
                            </div>
                            <div>
                                <p className="text-sm text-white/70">Job Types</p>
                                <p className="text-3xl font-bold text-white">{Object.keys(typeData).length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Analytics Toggle Button */}
            <div className="flex justify-center mt-4 mb-6">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowCharts(!showCharts)}
                    className="gap-2 border-border hover:bg-secondary"
                >
                    <BarChart3 className="h-4 w-4" />
                    {showCharts ? 'Hide Analytics' : 'Show Analytics'}
                    <motion.div
                        animate={{ rotate: showCharts ? 180 : 0 }}
                        transition={{ duration: 0.3 }}
                    >
                        <ChevronDown className="h-4 w-4" />
                    </motion.div>
                </Button>
            </div>

            {/* Collapsible Charts */}
            <AnimatePresence>
                {showCharts && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                    >
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Jobs by Location */}
                            <Card className="bg-card border-border">
                                <CardContent className="p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-4">Jobs by Location</h4>
                                    <div className="h-48">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={locationChartData} layout="vertical">
                                                <XAxis type="number" hide />
                                                <YAxis
                                                    type="category"
                                                    dataKey="name"
                                                    width={100}
                                                    tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }}
                                                />
                                                <Tooltip
                                                    contentStyle={{
                                                        background: 'hsl(var(--card))',
                                                        border: '1px solid hsl(var(--border))',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                                <Bar dataKey="value" fill="hsl(215, 55%, 24%)" radius={[0, 4, 4, 0]} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Jobs by Type */}
                            <Card className="bg-card border-border">
                                <CardContent className="p-5">
                                    <h4 className="text-sm font-semibold text-foreground mb-4">Jobs by Type</h4>
                                    <div className="h-48 flex items-center">
                                        <ResponsiveContainer width="50%" height="100%">
                                            <PieChart>
                                                <Pie
                                                    data={typeChartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    innerRadius={40}
                                                    outerRadius={70}
                                                    paddingAngle={2}
                                                    dataKey="value"
                                                >
                                                    {typeChartData.map((_, index) => (
                                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                                    ))}
                                                </Pie>
                                                <Tooltip
                                                    contentStyle={{
                                                        background: 'hsl(var(--card))',
                                                        border: '1px solid hsl(var(--border))',
                                                        borderRadius: '8px',
                                                    }}
                                                />
                                            </PieChart>
                                        </ResponsiveContainer>
                                        <div className="flex-1 space-y-2">
                                            {typeChartData.map((item, index) => (
                                                <div key={item.name} className="flex items-center gap-2 text-sm">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                                                    />
                                                    <span className="text-muted-foreground">{item.name}</span>
                                                    <span className="text-foreground font-medium ml-auto">{item.value}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}

