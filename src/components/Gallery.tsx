import React from "react";
import { motion } from "motion/react";
import { ds } from "../design-system/classes";

const images = [
  "https://images.unsplash.com/photo-1627813173262-fa4cd4fa7d5e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1660300110666-9ff243d1328a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1675526607070-f5cbd71dde92?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  "https://images.unsplash.com/photo-1762625570087-6d98fca29531?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080",
  // Reusing some generic ones or placeholders for the grid effect if needed
  "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&q=80&w=800", // Smile
  "https://images.unsplash.com/photo-1588776814546-1b8c1ddfd819?auto=format&fit=crop&q=80&w=800", // Dental tools
  "https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&q=80&w=800", // Clean clinic
  "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&q=80&w=800", // Happy patient
  "https://images.unsplash.com/photo-1600170311833-c2cf5280ce49?auto=format&fit=crop&q=80&w=800", // White teeth
];

export function Gallery() {
  return (
    <section id="gallery" className="py-24 bg-bg-default">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className={`text-3xl md:text-5xl ${ds.headingSection} mb-4`}>
            Our Shining Results
          </h2>
          <p className={`${ds.textBody} max-w-2xl mx-auto`}>
            See the transformations and happy smiles from our wonderful clients.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {images.map((src, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="group relative aspect-square overflow-hidden rounded-[var(--radius-lg)] bg-neutral-50 cursor-pointer"
            >
              <img
                src={src}
                alt={`Gallery image ${idx + 1}`}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-neutral-900/0 group-hover:bg-neutral-900/15 transition-colors duration-300" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
