"use client"

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./accordion"

function Demo() {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="what-is-fumadocs">
        <AccordionTrigger>What is Fumadocs?</AccordionTrigger>
        <AccordionContent>
          <p>A framework for building documentations</p>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="what-do-we-love">
        <AccordionTrigger>What do we love?</AccordionTrigger>
        <AccordionContent>
          <p>We love building great developer experiences</p>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  )
}

export { Demo }