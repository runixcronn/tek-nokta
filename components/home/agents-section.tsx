'use client';

import React, { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useStore } from '@/hooks/use-store';
import { fetchAgents } from '@/lib/api';
import { Agent } from '@/lib/data';
import { contextContent } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';

export function AgentsSection() {
  const { context } = useStore();

  const currentCopy = contextContent[context];

  const { data: agentsList = [], isLoading: agentsLoading } = useQuery({
    queryKey: ['agents'],
    queryFn: fetchAgents,
  });

  const filteredAgents = useMemo(
    () => agentsList.filter((agent: Agent) => agent.context === context),
    [agentsList, context],
  );

  return (
    <section id="agents" className="bg-bg-white py-16 md:py-24">
      <div className="mx-auto max-w-[1200px] px-4">
        <div className="mx-auto mb-12 max-w-[600px] text-center">
          <h2 className="mb-2 text-[28px] font-bold tracking-tight text-text-dark md:text-[32px]">
            {currentCopy.agentsTitle}
          </h2>
          <p className="text-[14px] text-text-muted">{currentCopy.agentsDescription}</p>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3">
          {agentsLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="overflow-hidden rounded-xl border border-border-custom bg-white"
                >
                  <Skeleton className="aspect-[3/4] w-full rounded-none" />
                  <div className="space-y-2 p-4">
                    <Skeleton className="mx-auto h-4 w-3/4" />
                    <Skeleton className="mx-auto h-3 w-1/2" />
                  </div>
                </div>
              ))
            : filteredAgents.map((agent) => (
                <div
                  key={agent.id}
                  className="group overflow-hidden rounded-xl border border-border-custom bg-white text-center shadow-sm transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    <img
                      src={agent.image}
                      alt={agent.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 flex items-end justify-center bg-gradient-to-t from-black/65 via-transparent to-transparent pb-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      <span className="rounded bg-primary px-3 py-1 text-[12px] font-semibold text-white">
                        İletişime Geç
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-[15px] font-semibold text-text-dark transition-colors group-hover:text-primary">
                      {agent.name}
                    </h3>
                    <p className="mt-0.5 text-[12px] text-text-muted">{agent.role}</p>
                  </div>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
