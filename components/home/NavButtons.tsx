"use client"
import { motion } from "framer-motion"
import { MessageSquare, Star, Zap } from 'lucide-react';
import { Montez } from 'next/font/google';
import Image from "next/image";
const montez = Montez({ subsets: ['latin'], weight: '400' });

const navItems = [
    {
        icon: MessageSquare,
        label: 'Influencer Feedback',
        targetId: 'influencer-feedback',
        color: 'text-pink-600',
        borderColor: 'border-pink-200',
        bg: 'bg-pink-50',
        hoverBg: 'group-hover:bg-pink-100',
        image: '/influencer feedback.png'
    },
    {
        icon: Star,
        label: 'Client Diary',
        targetId: 'customer-reviews',
        color: 'text-rose-600',
        borderColor: 'border-rose-200',
        bg: 'bg-rose-50',
        hoverBg: 'group-hover:bg-rose-100',
        image: '/diary.png'
    },
    {
        icon: Zap,
        label: 'Prerna Magic',
        targetId: 'dispatch-magic',
        color: 'text-fuchsia-600',
        borderColor: 'border-fuchsia-200',
        bg: 'bg-fuchsia-50',
        hoverBg: 'group-hover:bg-fuchsia-100',
        image: '/dispatch.png'
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
        <section className="mb-6 md:mb-8">
            <div className="w-full h-auto mx-auto mb-12 md:mb-12 bg-[#f9cce9] overflow-hidden">
                <Image
                    src="/LET US KNOW.jpg"
                    alt="LET US KNOW"
                    width={1024}
                    height={1024}
                    className="w-full h-auto mx-auto translate-x-0"
                    priority
                />
            </div>
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


                            <Image src={item.image} alt={item.label} width={72} height={72} />

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
