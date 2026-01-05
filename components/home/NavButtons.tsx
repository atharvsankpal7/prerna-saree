"use client"
import { motion } from "framer-motion"
import { MessageSquare, Star, Zap } from 'lucide-react';

const navItems = [
    {
        icon: MessageSquare,
        label: 'Influencer Feedback',
        targetId: 'influencer-feedback',
        color: 'text-pink-600',
        borderColor: 'border-pink-200',
        bg: 'bg-pink-50',
        hoverBg: 'group-hover:bg-pink-100'
    },
    {
        icon: Star,
        label: 'Customer Review',
        targetId: 'customer-reviews',
        color: 'text-rose-600',
        borderColor: 'border-rose-200',
        bg: 'bg-rose-50',
        hoverBg: 'group-hover:bg-rose-100'
    },
    {
        icon: Zap,
        label: 'Dispatch Magic',
        targetId: 'dispatch-magic',
        color: 'text-fuchsia-600',
        borderColor: 'border-fuchsia-200',
        bg: 'bg-fuchsia-50',
        hoverBg: 'group-hover:bg-fuchsia-100'
    },
];

const NavButtons = () => {
    const scrollToSection = (id: string | null) => {
        if (!id) return;
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <section className="py-10">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                viewport={{ once: true }}
                className="text-center mb-12"
            >
                <span className="inline-block py-1 px-3 rounded-full bg-pink-100 text-pink-800 text-sm font-semibold tracking-wide mb-4 font-body">
                    #PrernaSareeMoments
                </span>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-bold text-[#93316a] mb-6 leading-tight">
                    Celebrate Every Moment <br className="hidden md:block" />
                    <span className="italic font-serif font-light text-[#461934]">in a Prerna Saree</span>
                </h2>
            </motion.div>

            <div className="max-w-4xl mx-auto px-4">
                <div className="flex justify-center gap-4 md:gap-16">
                    {navItems.map((item, index) => (
                        <motion.button
                            key={item.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.1 }}
                            viewport={{ once: true }}
                            onClick={() => scrollToSection(item.targetId)}
                            className="group flex flex-col items-center gap-3 focus:outline-none flex-1 max-w-[120px]"
                        >
                            <div className={`w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-full ${item.bg} ${item.borderColor} border-2 flex items-center justify-center transition-all duration-300 ${item.hoverBg} shadow-sm group-hover:shadow-md group-hover:scale-110`}>
                                <item.icon className={`w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 ${item.color} transition-transform duration-300 group-hover:rotate-12`} />
                            </div>
                            <span className="font-heading font-semibold text-gray-800 text-[10px] sm:text-xs md:text-base group-hover:text-[#93316a] transition-colors text-center leading-tight">
                                {item.label}
                            </span>
                        </motion.button>
                    ))}
                </div>
            </div>
        </section>
    )
}

export default NavButtons
